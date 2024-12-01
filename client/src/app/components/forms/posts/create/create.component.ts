import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../../classes/posts.class';

@Component({
  selector: 'create-post',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreatePostForm {
  @Input() mode: string = 'student';

  postData: Post = new Post();

  @Output() postCreated: EventEmitter<any> = new EventEmitter();

  constructor() {}

  onCreatePost() {
    this.postCreated.emit(this.postData);
  }
}
