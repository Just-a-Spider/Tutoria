import { ApiProperty } from '@nestjs/swagger';

export class StudentProfileDto {
  @ApiProperty({ description: 'URL of the profile picture' })
  profile_picture: string;
}

export class TutorProfileDto extends StudentProfileDto {
  @ApiProperty({ description: 'Biography of the tutor' })
  bio: string;

  @ApiProperty({ description: 'Rating of the tutor', example: 4.5 })
  rating: number;

  @ApiProperty({
    description: 'Number of students helped by the tutor',
    example: 100,
  })
  helped: number;
}
