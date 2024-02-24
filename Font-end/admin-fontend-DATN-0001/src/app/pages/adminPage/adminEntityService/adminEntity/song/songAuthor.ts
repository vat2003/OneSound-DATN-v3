export class SongAuthor {
  songId: number;
  authorId: number;

  constructor(songId: number = 0, authorId: number = 0) {
      this.songId = songId;
      this.authorId = authorId;
  }
}
