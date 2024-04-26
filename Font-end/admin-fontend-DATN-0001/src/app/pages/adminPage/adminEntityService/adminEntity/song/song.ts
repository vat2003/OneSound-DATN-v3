import {Album} from "../album/album";
import { Singer } from "../singer/singer";

export class Song {
  id!: number;
  name: string;
  image: string;
  path: string;
  lyrics: string;
  release_date: Date;
  description: string;
  dateTemp: string;
  album: Album;
  active:boolean;
  singer!: any;
  sg!:any;

  constructor(
    name: string = '',
    image: string = '',
    // release: number = new Date().getFullYear(),
    release_date: Date = new Date(),
    description: string = '',
    path: string = '',
    lyrics: string = '',
    album: Album = new Album(),
    dateTemp: string = '',
    active:boolean=true,
  ) {
    this.name = name;
    this.image = image;
    this.release_date = release_date;
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
