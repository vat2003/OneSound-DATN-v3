export class FavoriteAlbum {
  accountId!: number;
  albumId!: number;

  constructor(accountId: number = -100, albumId: number = -100) {
    this.accountId = accountId;
    this.albumId = albumId;
  }
}
