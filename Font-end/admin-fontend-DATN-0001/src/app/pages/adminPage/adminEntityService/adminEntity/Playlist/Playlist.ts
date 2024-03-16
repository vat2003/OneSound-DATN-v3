export class Playlist {
  id?: number;
  name: string;
  user_id?: { id: number };
  likeDate?: Date; // Change createdate to likeDate

  constructor(id?: number, name: string = '', user?: { id: number }, likeDate?: Date) {
    this.id = id;
    this.name = name;
    this.user_id = user;
    this.likeDate = likeDate; // Change createdate to likeDate

  }
}
