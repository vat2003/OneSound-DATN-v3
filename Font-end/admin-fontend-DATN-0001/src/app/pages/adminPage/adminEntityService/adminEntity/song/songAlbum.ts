export class SongAlbum {
  songId: number;
  albumId: number;

  constructor(songId: number = 0, albumId: number = 0) {
      this.songId = songId;
      this.albumId = albumId;
  }
}
