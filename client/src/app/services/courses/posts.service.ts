import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OfferHelpPost, RequestHelpPost } from '../../classes/posts.class';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageData } from '../../interfaces/page-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private apiUrl = environment.apiUrl + 'courses/';
  private selectedPostData: BehaviorSubject<
    [{ id: string }, { type: string }]
  > = new BehaviorSubject([{ id: '' }, { type: '' }]);
  selectedPostId$ = this.selectedPostData.asObservable();

  constructor(private http: HttpClient) {}

  // Generic method to fetch posts
  private fetchPosts(
    courseId: string,
    endpoint: string,
    nextPrev: string = ''
  ): Observable<PageData> {
    const url =
      nextPrev === '' ? `${this.apiUrl}${courseId}/${endpoint}/` : nextPrev;
    return this.http.get<PageData>(url, {
      withCredentials: true,
    });
  }

  // -------------------------------------------------------------------------------
  // Request My Posts
  getMyPosts(courseId: string, nextPrev: string = '') {
    return this.fetchPosts(courseId, 'my-posts', nextPrev);
  }

  // Request Help Posts
  getRequestHelpPosts(courseId: string, nextPrev: string = '') {
    return this.fetchPosts(courseId, 'request-help-posts', nextPrev);
  }

  createRequestHelpPost(courseId: string, data: RequestHelpPost) {
    return this.http.post(
      `${this.apiUrl}${courseId}/request-help-posts/`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  // -------------------------------------------------------------------------------
  // Offer Help Posts
  getOfferHelpPosts(courseId: string, nextPrev: string = '') {
    return this.fetchPosts(courseId, 'offer-help-posts', nextPrev);
  }

  createOfferHelpPost(courseId: string, data: OfferHelpPost) {
    return this.http.post(`${this.apiUrl}${courseId}/offer-help-posts/`, data, {
      withCredentials: true,
    });
  }

  // -------------------------------------------------------------------------------
  // Comments
  getComments(courseId: string, postType: string, postId: string) {
    return this.http.get(
      `${this.apiUrl}${courseId}/${postType}-help-posts/${postId}/comments/`,
      {
        withCredentials: true,
      }
    );
  }

  createComment(
    courseId: string,
    postId: string,
    postType: string,
    comment: string,
    profileMode: string
  ) {
    return this.http.post(
      `${this.apiUrl}${courseId}/${postType}-help-posts/${postId}/comments/?profile_mode=${profileMode}`,
      { content: comment },
      {
        withCredentials: true,
      }
    );
  }

  // -------------------------------------------------------------------------------
  // For both Request and Offer Help Posts
  editPost(courseId: string, postType: string, postId: string, data: any) {
    return this.http.put(
      `${this.apiUrl}${courseId}/${postType}-help-posts/${postId}/`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  deletePost(courseId: string, postType: string, postId: string) {
    return this.http.delete(
      `${this.apiUrl}${courseId}/${postType}-help-posts/${postId}/`,
      {
        withCredentials: true,
      }
    );
  }

  // -------------------------------------------------------------------------------
  // For the selected post
  setSelectedPostId(postId: string, postType: string) {
    this.selectedPostData.next([{ id: postId }, { type: postType }]);
  }
}
