export class StudentProfileDto {
  profile_picture: string;
}

export class TutorProfileDto extends StudentProfileDto {
  bio: string;
  rating: number;
  helped: number;
}
