import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
  @ApiProperty({
    required: false,
    description: 'The unique identifier of the course',
  })
  id?: number;

  @ApiProperty({ required: false, description: 'The faculty of the course' })
  faculty?: string;

  @ApiProperty({ required: false, description: 'The name of the course' })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'The number of students enrolled in the course',
  })
  students?: number;

  @ApiProperty({
    required: false,
    description: 'The number of tutors for the course',
  })
  tutors?: number;

  @ApiProperty({
    required: false,
    description: 'The number of try-out tutors for the course',
  })
  try_out_tutors?: number;

  @ApiProperty({
    required: false,
    description: 'Indicates if the user is a student',
  })
  is_student?: boolean;

  @ApiProperty({
    required: false,
    description: 'Indicates if the user is a tutor',
  })
  is_tutor?: boolean;

  @ApiProperty({
    required: false,
    description: 'Indicates if the user is a try-out tutor',
  })
  is_try_out_tutor?: boolean;
}
