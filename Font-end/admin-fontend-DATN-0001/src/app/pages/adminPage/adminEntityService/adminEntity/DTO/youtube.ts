export class Youtube {
  id!: string;
  title!: string;
  description!: string;
  thumbnails!: string;
  channelTitle!: string;
  publishTime!: string;

  constructor(
    id: string = '',
    title: string = '',
    description: string = '',
    thumbnails: string = '',
    channelTitle: string = '',
    publishTime: string = ''
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnails = thumbnails;
    this.channelTitle = channelTitle;
    this.publishTime = publishTime;
  }
}