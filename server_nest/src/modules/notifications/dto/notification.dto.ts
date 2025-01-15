import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ description: 'Title of the notification' })
  title: string;

  @ApiProperty({ description: 'Content of the notification' })
  content: string;

  @ApiProperty({ description: 'Instance ID associated with the notification' })
  instance_id: string;

  @ApiProperty({
    description: 'Sub-instance ID associated with the notification',
  })
  subinstance_id: string;

  @ApiProperty({ description: 'User associated with the notification' })
  user: string;
}
