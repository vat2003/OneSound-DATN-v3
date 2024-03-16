// export class Singer {
  
//   id!: number;
//   fullname: string;
//   description: string;
//   image: string;
//   active: boolean

//   // singerAlbums: SingerAlbum[]; // Thêm một mảng singerAlbums
//   // songSinger: SongSinger[];

//   constructor(
//     fullname: string = '',
//     description: string = '',
//     image: string = '',
//     active: boolean,
//   ) {
//     this.fullname = fullname;
//     this.description = description;
//     this.image = image;
//     this.active = active; // Sử dụng dấu bằng (=) để gán giá trị cho thuộc tính active.

//   }
// }

export class Singer {
  
  id!: number;
  fullname: string = '';
  description: string = '';
  image: string = '';
  active: boolean = false;

  constructor() {
  }
}
