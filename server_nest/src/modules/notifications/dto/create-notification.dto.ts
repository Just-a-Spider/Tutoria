export class CreateNotificationDto {
  title: string;
  content: string;
  instanceId: string;
  subinstanceId: string;
  user: number;

  constructor(
    title: string,
    content: string,
    instanceId: string,
    subinstanceId: string,
    user: number,
  ) {
    this.title = title;
    this.content = content;
    this.instanceId = instanceId;
    this.subinstanceId = subinstanceId;
    this.user = user;
  }
}
