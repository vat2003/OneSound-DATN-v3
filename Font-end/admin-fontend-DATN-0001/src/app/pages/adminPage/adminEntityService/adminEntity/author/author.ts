export class Author {
  id!: number;
  fullname: string;
  description: string;
  image: string;

  constructor(
    fullname: string = '',
    description: string = '',
    image: string = '',
  ) {
    this.fullname = fullname;
    this.description = description;
    this.image = image;

  }
}
