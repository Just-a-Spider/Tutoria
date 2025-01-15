import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({
    description: 'The unique identifier of the comment',
  })
  id: string;

  @ApiProperty({
    description: 'The user who made the comment',
  })
  user: string;

  @ApiProperty({ description: 'The content of the comment', required: false })
  content: string;

  @ApiProperty({
    description: 'The date and time when the comment was created',
  })
  created_at: string;

  @ApiProperty({
    description: "The URL of the user's profile picture",
  })
  pfp_url: string;
}
