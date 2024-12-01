import { Component, Input, OnInit } from '@angular/core';
import {
  OfferHelpPost,
  RequestHelpPost,
} from '../../../../../classes/posts.class';
import { PostsService } from '../../../../../services/courses/posts.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  @Input() post: RequestHelpPost | OfferHelpPost | null = null;
  @Input() mobile = false;
  postId = '';
  postType = '';

  comment = '';
  comments: any[] = [];

  hostUrl = environment.hostUrl;

  constructor(
    private postsService: PostsService,
    private activeRoute: ActivatedRoute
  ) {
    this.postsService.selectedPostId$.subscribe((postData) => {
      if (postData) {
        this.getComments(postData[0].id, postData[1].type);
        this.postId = postData[0].id;
        this.postType = postData[1].type;
      }
    });
  }

  ngOnInit() {}

  getComments(postId: string, postType: string) {
    // Get the course id from the query parameters
    this.activeRoute.queryParams.subscribe((params) => {
      const courseId = params['id'];
      if (courseId) {
        this.postsService.getComments(courseId, postType, postId).subscribe({
          next: (comments: any) => {
            this.comments = comments.results;
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  sendComment() {
    if (this.comment === '') {
      return;
    }
    // Get the course id from the query parameters
    this.activeRoute.queryParams.subscribe((params) => {
      const courseId = params['id'];
      const profile_mode = localStorage.getItem('profileMode') || 'student';
      if (courseId) {
        this.postsService
          .createComment(
            courseId,
            this.postId,
            this.postType,
            this.comment,
            profile_mode
          )
          .subscribe({
            next: (comment: any) => {
              // Set the comment on top of the commets list
              this.comments.unshift(comment);
              this.comment = '';
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    });
  }

  isRequestHelpPost(post: any): post is RequestHelpPost {
    return post && (post as RequestHelpPost).student !== undefined;
  }
}
