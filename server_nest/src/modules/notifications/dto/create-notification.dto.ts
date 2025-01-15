import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Title of the notification' })
  title: string;

  @ApiProperty({ description: 'Content of the notification' })
  content: string;

  @ApiProperty({ description: 'Instance ID related to the notification' })
  instanceId: string;

  @ApiProperty({ description: 'Sub-instance ID related to the notification' })
  subinstanceId: string;

  @ApiProperty({ description: 'User ID associated with the notification' })
  user: number;
}
