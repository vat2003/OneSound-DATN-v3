export class FavoriteYoutbe {
  accountId!: number;
  youtubeId!: string;

  constructor(accountId: number = -100, youtubeId: string = '') {
    this.accountId = accountId;
    this.youtubeId = youtubeId;
  }
}
