import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ description: 'ID token from Google' })
  idToken: string;

  @ApiProperty({ description: 'Access token from Google' })
  accessToken: string;
}
