import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  title: string;

  @ApiProperty({ description: 'The description of the post' })
  description: string;

  @ApiProperty({ description: 'The subject of the post' })
  subject: string;
}
