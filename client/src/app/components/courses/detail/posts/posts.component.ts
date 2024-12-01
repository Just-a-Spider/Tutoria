import { Component, Input, OnChanges } from '@angular/core';
import {
  OfferHelpPost,
  RequestHelpPost,
} from '../../../../classes/posts.class';
import { PostsService } from '../../../../services/courses/posts.service';
import { ThemeService } from '../../../../services/misc/theme.service';
import { PageData } from '../../../../interfaces/page-data.interface';

interface Column {
  field: string;
  header: string;
}

const postTypeMap = {
  'Solicitud de ayuda': 'request',
  'Oferta de ayuda': 'offer',
};

@Component({
  selector: 'course-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnChanges {
  @Input() courseId: string = '';
  // Pages for the posts
  requestHelpPage: PageData = new PageData();
  offerHelpPage: PageData = new PageData();
  myPostsPage: PageData = new PageData();
  // Boolean to show/hide the create post dialog
  dialogHeader: string = 'Crear Publicación';
  showDialog: boolean = false;
  selectedPost: any | null = null;
  // Mode of the profile (student or tutor)
  mode: string = 'student';
  // For the table
  offerHelpTable: boolean = false;
  ogColumns: Column[] = [
    { field: 'title', header: 'Título' },
    { field: 'subject', header: 'Materia' },
    { field: 'student', header: 'Estudiante' },
    { field: 'tutor', header: 'Tutor' },
    { field: 'created_at', header: 'Fecha de Creación' },
  ];
  columns: Column[] = this.ogColumns;
  myColumns: Column[] = [
    { field: 'title', header: 'Título' },
    { field: 'subject', header: 'Materia' },
    { field: 'post_type', header: 'Tipo' },
    { field: 'created_at', header: 'Fecha de Creación' },
  ];

  tableRows: number = 10;

  mobile = false;
  mainClass = 'flex flex-row w-full justify-content-between';
  tablesClass = 'col-10 border-2 border-dotted border-round';
  dialogStyle = { width: '60vh', margin: '0 auto' };

  constructor(
    private postsService: PostsService,
    public themeService: ThemeService
  ) {
    this.themeService.mobileMode$.subscribe((mode) => {
      this.mobile = mode;
      this.mainClass = mode
        ? 'flex flex-column w-screen p-2 justify-content-start'
        : 'flex flex-row w-full justify-content-between';
      this.tablesClass = mode
        ? 'w-full border-2 border-dotted border-round'
        : 'col-10 border-2 border-dotted border-round';
      this.dialogStyle = mode
        ? { width: '90vw', margin: '0 auto' }
        : { width: '60vh', margin: '0 auto' };
    });
    this.columns = this.columns.filter((column) => column.field !== 'tutor');
    this.themeService.profileMode$.subscribe((mode) => {
      this.mode = mode;
    });
    if (this.courseId !== '') {
      this.getPosts();
    }
  }

  ngOnChanges() {
    this.getPosts();
  }

  getPosts() {
    this.fetchPostsByType('request');
    this.fetchPostsByType('offer');
    this.fetchPostsByType('mine');
  }

  fetchPostsByType(type: string) {
    let fetchObservable;
    switch (type) {
      case 'request':
        fetchObservable = this.postsService.getRequestHelpPosts(this.courseId);
        break;
      case 'offer':
        fetchObservable = this.postsService.getOfferHelpPosts(this.courseId);
        break;
      case 'mine':
        fetchObservable = this.postsService.getMyPosts(this.courseId);
        break;
    }
    fetchObservable!.subscribe({
      next: (posts: PageData) => {
        switch (type) {
          case 'request':
            this.requestHelpPage = posts;
            break;
          case 'offer':
            this.offerHelpPage = posts;
            break;
          case 'mine':
            this.myPostsPage = posts;
            break;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createPost(postData: RequestHelpPost | OfferHelpPost) {
    const handlePostResponse = (post: any) => {
      if (this.mode === 'student') {
        this.requestHelpPage.results.unshift(post);
      } else if (this.mode === 'tutor') {
        this.offerHelpPage.results.unshift(post);
      }
      this.myPostsPage.results.unshift(post);
    };

    const postObservable =
      this.mode === 'student'
        ? this.postsService.createRequestHelpPost(this.courseId, postData)
        : this.postsService.createOfferHelpPost(this.courseId, postData);

    postObservable.subscribe({
      next: (post: any) => {
        handlePostResponse(post);
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.showDialog = false;
  }

  onTabChange(event: number) {
    if (event === 0) {
      // Filter the tutor column
      this.columns = this.ogColumns.filter(
        (column) => column.field !== 'tutor'
      );
    } else if (event === 1) {
      // Filter the student column
      this.columns = this.ogColumns.filter(
        (column) => column.field !== 'student'
      );
    }
  }

  showPost(postId: string, postType: string) {
    if (postType in postTypeMap) {
      postType = postTypeMap[postType as keyof typeof postTypeMap];
    }

    this.postsService.setSelectedPostId(postId, postType);
    // Get the instance title to set it as the dialog header
    let post =
      postType === 'request'
        ? this.requestHelpPage.results
        : this.offerHelpPage.results;
    let selectedPost = post.find((post) => post.id === postId);
    this.selectedPost = selectedPost ?? null;
    this.dialogHeader = selectedPost?.title || 'Publicación';
    this.showDialog = true;
  }

  editPost(post: any) {}

  deletePost(postId: string, postType: string) {
    const type = postType === 'Solicitud de ayuda' ? 'request' : 'offer';
    this.postsService.deletePost(this.courseId, type, postId).subscribe({
      next: () => {
        this.fetchPostsByType(type);
        this.fetchPostsByType('mine');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
