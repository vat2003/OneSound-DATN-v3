export class Author {
  id!: number;
  fullname: string;
  description: string;
  image: string;
  active:boolean;

  constructor(
    fullname: string = '',
    description: string = '',
    image: string = '',
    active:boolean=true
  ) {
    this.fullname = fullname;
    this.description = description;
    this.image = image;
    this.active=active
  }
}
