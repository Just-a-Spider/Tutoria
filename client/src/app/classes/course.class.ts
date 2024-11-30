export class SimpleCourse {
  id?: number;
  faculty?: string;
  name?: string;
}

export class Course extends SimpleCourse {
  students?: number;
  tutors?: number;
  try_out_tutors?: number;
  is_student?: boolean;
  is_tutor?: boolean;
  is_tryout_tutor?: boolean;
}
