export class Song {
  id!: number;
  image: string;
  lyrics: string;
  name: string;
  path: string;
  album_id: number;

  constructor(
    image: string = '',
    lyrics: string = '',
    name: string = '',
    path: string = '',
    album_id: number = -1111
  ) {
    this.image = image;
    this.lyrics = lyrics;
    this.name = name;
    this.path = path;
    this.album_id = album_id;
  }
}
