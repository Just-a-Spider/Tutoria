import { Course } from './course.class';

export interface LoginProps {
  email_username: string;
  password: string;
}

export interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  gender?: boolean;
}

export class User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: boolean;

  constructor(
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    gender: boolean
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
  }
}

export class StudentProfile {
  profile_picture: string;
  linked_courses: Course[];
  user: User;

  constructor(profile_picture: string, linked_courses: Course[], user: User) {
    this.profile_picture = profile_picture;
    this.linked_courses = linked_courses;
    this.user = user;
  }
}

export class TutorProfile {
  profile_picture: string;
  bio: string;
  linked_courses: Course[];
  rating: number;
  helped: number;
  user: User;

  constructor(
    profile_picture: string,
    bio: string,
    linked_courses: Course[],
    rating: number,
    helped: number,
    user: User
  ) {
    this.profile_picture = profile_picture;
    this.bio = bio;
    this.linked_courses = linked_courses;
    this.rating = rating;
    this.helped = helped;
    this.user = user;
  }
}
