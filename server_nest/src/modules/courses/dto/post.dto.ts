import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ description: 'The unique identifier of the post' })
  id?: string;

  @ApiProperty({ description: 'The title of the post' })
  title?: string;

  @ApiProperty({ description: 'The description of the post' })
  description?: string;

  @ApiProperty({ description: 'The subject of the post' })
  subject?: string;

  @ApiProperty({ description: 'The creation date of the post' })
  created_at?: string;

  @ApiProperty({ description: 'The last update date of the post' })
  updated_at?: string;

  @ApiProperty({ description: 'The profile picture URL of the post' })
  pfp_url?: string;

  @ApiProperty({ description: 'The student associated with the post' })
  student?: string;

  @ApiProperty({ description: 'The tutor associated with the post' })
  tutor?: string;
}

export class MyPostDto extends PostDto {
  @ApiProperty({ description: 'The type of the post' })
  post_type?: string;
}
