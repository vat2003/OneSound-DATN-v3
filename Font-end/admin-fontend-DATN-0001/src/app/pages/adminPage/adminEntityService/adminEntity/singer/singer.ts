export class Singer {
  
  id!: number;
  fullname: string;
  description: string;
  image: string;
  // singerAlbums: SingerAlbum[]; // Thêm một mảng singerAlbums
  // songSinger: SongSinger[];

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
