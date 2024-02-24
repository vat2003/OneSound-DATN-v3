export class SongGenre {
  songId: number;
  genreId: number;

  constructor(songId: number = 0, genreId: number = 0) {
      this.songId = songId;
      this.genreId = genreId;
  }
}
