import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  last_name: string;

  @ApiProperty({ description: 'Username of the user', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  password: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@example.com',
  })
  email: string;
}
