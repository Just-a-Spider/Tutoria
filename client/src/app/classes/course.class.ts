export class SimpleCourse {
  id?: number;
  faculty?: string;
  name?: string;
}

export class Course extends SimpleCourse {
  students?: number;
  tutors?: number;
  try_out_tutors?: number;
}
