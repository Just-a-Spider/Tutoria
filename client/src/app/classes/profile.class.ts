export class StudentProfile {
  profile_picture: string;

  constructor() {
    this.profile_picture = '';
  }
}

export class TutorProfile extends StudentProfile {
  bio: string;
  rating: number;
  helped: number;

  constructor() {
    super();
    this.bio = '';
    this.rating = 0;
    this.helped = 0;
  }
}
