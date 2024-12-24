import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { isInstance } from 'class-validator';
import { PageData } from '@/lib/paginator/dto/page-data.dto';
import { Paginator } from '@/lib/paginator/paginator';
import { ProfilesService } from '../../profiles/profiles.service';
import { CommentDto } from '../dto/comment.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { MyPostDto, PostDto } from '../dto/post.dto';
import { Comment } from '../entities/comment.entity';
import { OfferHelpPost } from '../entities/offer-help-post.entity';
import { RequestHelpPost } from '../entities/request-help-post.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly profilesService: ProfilesService,
    @InjectRepository(RequestHelpPost)
    private readonly rHelpPostRepository: EntityRepository<RequestHelpPost>,
    @InjectRepository(OfferHelpPost)
    private readonly oHelpPostRepository: EntityRepository<OfferHelpPost>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,

    private eventEmitter: EventEmitter2,
    private paginator: Paginator,
  ) {}

  async getMyPosts(
    userId: number,
    courseId: number,
    offset: number = 0,
    endpoint: string,
  ): Promise<PageData> {
    let requestHelpPosts: RequestHelpPost[] = [];
    let offerHelpPosts: OfferHelpPost[] = [];

    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    if (!studentProfile && !tutorProfile) {
      throw new NotFoundException('User profiles not found');
    }
    try {
      requestHelpPosts = await this.rHelpPostRepository.find(
        {
          $and: [{ course: courseId }, { student: studentProfile }],
        },
        { orderBy: { createdAt: 'DESC' } },
      );

      offerHelpPosts = await this.oHelpPostRepository.find(
        {
          $and: [{ course: courseId }, { tutor: tutorProfile }],
        },
        { orderBy: { createdAt: 'DESC' } },
      );

      const posts = [...requestHelpPosts, ...offerHelpPosts].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      const myPosts = posts.map((post) =>
        plainToInstance(MyPostDto, {
          id: post.id,
          title: post.title,
          description: post.description,
          subject: post.subject,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          pfp_url: isInstance(post, RequestHelpPost)
            ? (post as RequestHelpPost).student.profile_picture
            : (post as OfferHelpPost).tutor.profile_picture,
          post_type: isInstance(post, RequestHelpPost)
            ? 'Solicitud de ayuda'
            : 'Oferta de ayuda',
        }),
      );

      return this.paginator.paginate<MyPostDto>(myPosts, offset, endpoint);
    } catch (error) {
      this.logger.error(error);
    }

    return null;
  }

  // Request Help Posts
  async getPosts(
    courseId: number,
    mode: string,
    offset: number = 0,
    endpoint: string,
  ): Promise<PageData> {
    let posts: OfferHelpPost[] | RequestHelpPost[] = [];
    if (mode === 'request') {
      posts = await this.rHelpPostRepository.find(
        { course: courseId },
        { orderBy: { createdAt: 'DESC' } },
      );
    } else {
      posts = await this.oHelpPostRepository.find(
        { course: courseId },
        {
          orderBy: { createdAt: 'DESC' },
        },
      );
    }

    const serializedPosts = posts.map((post) =>
      plainToInstance(PostDto, {
        id: post.id,
        title: post.title,
        description: post.description,
        subject: post.subject,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        pfp_url: isInstance(post, RequestHelpPost)
          ? (post as RequestHelpPost).student.profile_picture
          : (post as OfferHelpPost).tutor.profile_picture,
        // Add the student or tutor username to the post based on the mode
        ...(mode === 'request'
          ? { student: (post as RequestHelpPost).student.user.username }
          : { tutor: (post as OfferHelpPost).tutor.user.username }),
      }),
    );

    return this.paginator.paginate<PostDto>(serializedPosts, offset, endpoint);
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    mode: string,
    courseId: number,
  ): Promise<PostDto> {
    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    let post: RequestHelpPost | OfferHelpPost;
    let profile: any;
    let repository:
      | EntityRepository<RequestHelpPost>
      | EntityRepository<OfferHelpPost>;

    if (mode === 'request') {
      profile = studentProfile;
      repository = this.rHelpPostRepository;
      post = repository.create({
        ...createPostDto,
        student: profile,
        course: courseId,
      });
    } else if (mode === 'offer') {
      profile = tutorProfile;
      repository = this.oHelpPostRepository;
      post = repository.create({
        ...createPostDto,
        tutor: profile,
        course: courseId,
      });
    } else {
      this.logger.error('Invalid mode');
      return null;
    }

    // Populate the course relation
    await repository.getEntityManager().populate(post, ['course']);

    const event = {
      title:
        mode === 'request' ? 'Nueva petición de ayuda' : 'Nuevo post de tutor',
      postId: post.id,
      courseId: post.course.id as number,
      user: profile.user.id as number,
      courseName: post.course.name,
      creatorUsername: profile.user.username,
    };
    const eventType =
      mode === 'request' ? 'post.student.created' : 'post.tutor.created';

    this.eventEmitter.emit(eventType, event);

    await repository.getEntityManager().persistAndFlush(post);

    return plainToInstance(PostDto, {
      id: post.id,
      title: post.title,
      description: post.description,
      subject: post.subject,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      pfp_url: profile.profile_picture,
      ...(mode === 'request'
        ? { student: profile.user.username }
        : { tutor: profile.user.username }),
    });
  }

  async getComments(
    postId: string,
    mode: string,
  ): Promise<{ results: CommentDto[] }> {
    let post: OfferHelpPost | RequestHelpPost;
    if (mode === 'request') {
      post = await this.rHelpPostRepository.findOne(
        { id: postId },
        { populate: ['comments'] },
      );
    } else {
      post = await this.oHelpPostRepository.findOne(
        { id: postId },
        { populate: ['comments'] },
      );
    }

    if (!post) {
      this.logger.error('Post not found');
      return { results: [] };
    }

    const comments = isInstance(post, RequestHelpPost)
      ? (post as RequestHelpPost).comments.getItems()
      : (post as OfferHelpPost).comments.getItems();

    return {
      results: comments.map((comment) =>
        plainToInstance(CommentDto, {
          id: comment.id,
          content: comment.content,
          created_at: comment.createdAt,
          updated_at: comment.updatedAt,
          user: comment.user.username,
          pfp_url: comment.pfpUrl,
        }),
      ),
    };
  }

  async createComment(
    userId: number,
    postId: string,
    mode: string,
    content: string,
    profileMode: string,
  ) {
    let post: OfferHelpPost | RequestHelpPost;
    if (mode === 'request') {
      post = await this.rHelpPostRepository.findOne({ id: postId });
    } else {
      post = await this.oHelpPostRepository.findOne({ id: postId });
    }

    if (!post) {
      this.logger.error('Post not found');
      return;
    }

    const { studentProfile, tutorProfile } =
      await this.profilesService.getBothProfiles(userId);

    const comment = await this.commentRepository.create({
      content,
      user: studentProfile.user,
      // Set the requestHelpPost or offerHelpPost based on the mode
      ...(mode === 'request'
        ? { requestHelpPost: post }
        : { offerHelpPost: post }),
      ...(profileMode === 'student'
        ? { pfpUrl: studentProfile.profile_picture }
        : { pfpUrl: tutorProfile.profile_picture }),
    });

    if (mode === 'request') {
      (post as RequestHelpPost).comments.add(comment);
    } else {
      (post as OfferHelpPost).comments.add(comment);
    }

    await this.rHelpPostRepository.getEntityManager().persistAndFlush(post);

    return plainToInstance(CommentDto, {
      id: comment.id,
      content: comment.content,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
      user: comment.user.username,
      pfp_url: comment.pfpUrl,
    });
  }
}
