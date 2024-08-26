import { User } from './user.class';

export class Message {
  author: User;
  content: string;
  created_at: Date;

  constructor(author: User, content: string, created_at: Date) {
    this.author = author;
    this.content = content;
    this.created_at = created_at;
  }
}
