export class Playlist {
    id?: number;
    name: string;
    user_id?: { id: number }; // Make user property optional

    constructor(id?: number, name: string = '', user?: { id: number }) {
        this.id = id;
        this.name = name;
        this.user_id = user;
    }
}
