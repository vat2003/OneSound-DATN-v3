export class Song {
  id!: number;
  name: string;
  image: string;
  path: string;
  lyrics: string;
  releaseDate: Date;
  description: string;


  constructor(
    name: string = '',
    image: string = '',
    // releaseDate: number = new Date().getFullYear(),
    releaseDate: Date = new Date(),
    description: string = '',
    path: string = '',
    lyrics: string = ''
  ) {
    this.name = name;
    this.image = image;
    this.releaseDate = releaseDate;
    // this.albumcreateDate = albumcreateDate;
    this.description = description;
    this.path = path;
    this.lyrics = lyrics;
  }

}

// export class Song {
//   id!: number;
//   title: string;
//   image: string;
//   path: string;
//   lyrics: string;
//   releaseDate: Date;
//   description: string;
//
//
//   constructor(
//       title: string = '',
//       image: string = '',
//       // releaseDate: number = new Date().getFullYear(),
//       releaseDate: Date = new Date(),
//       description: string = '',
//       path:string='',
//       lyrics:string=''
//   ) {
//       this.title = title;
//       this.image = image;
//       this.releaseDate = releaseDate;
//       // this.albumcreateDate = albumcreateDate;
//       this.description = description;
//       this.path=path;
//       this.lyrics=lyrics;
//   }
//
// }
