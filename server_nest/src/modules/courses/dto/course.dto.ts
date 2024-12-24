export class CourseDto {
  id?: number;
  faculty?: string;
  name?: string;
  students?: number;
  tutors?: number;
  try_out_tutors?: number;
  is_student?: boolean;
  is_tutor?: boolean;
  is_try_out_tutor?: boolean;
}
