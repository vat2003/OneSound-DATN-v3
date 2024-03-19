export class SingerAlbum{
  albumId: number;
  singerId: number;

  constructor(albumId: number = 0, singerId: number = 0) {
      this.albumId = albumId;
      this.singerId = singerId;
  }
}
