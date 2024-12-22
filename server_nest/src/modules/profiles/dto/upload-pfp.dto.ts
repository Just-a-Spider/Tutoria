import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadProfilePictureDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  profile_picture: any;
}
