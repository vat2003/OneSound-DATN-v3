export class FavoriteSong {
  accountId!: number;
  songId!: number;

  constructor(accountId: number = -100, songId: number = -100) {
    this.accountId = accountId;
    this.songId = songId;
  }
}
