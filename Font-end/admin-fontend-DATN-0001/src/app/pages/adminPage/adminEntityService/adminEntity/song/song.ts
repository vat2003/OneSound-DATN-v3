import {Album} from "../album/album";

export class Song {
  id!: number;
  name: string;
  image: string;
  path: string;
  lyrics: string;
  release: Date;
  description: string;
  dateTemp: string;
  album: Album;
  active:boolean;

  constructor(
    name: string = '',
    image: string = '',
    // release: number = new Date().getFullYear(),
    release: Date = new Date(),
    description: string = '',
    path: string = '',
    lyrics: string = '',
    album: Album = new Album(),
    dateTemp: string = '',
    active:boolean=true
  ) {
    this.name = name;
    this.image = image;
    this.release = release;
    // this.albumcreateDate = albumcreateDate;
    this.description = description;
    this.path = path;
    this.lyrics = lyrics;
    this.album = album;
    this.dateTemp = dateTemp;
    this.active=active;
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
