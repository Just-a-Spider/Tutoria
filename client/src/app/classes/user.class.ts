export class User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;

  constructor() {
    this.id = 0;
    this.first_name = '';
    this.last_name = '';
    this.username = '';
    this.email = '';
  }
}
