import { Song } from "../song/song";

export class Album {
    id!: number;
    title: string;
    image: string;
    releaseYear: number;
    albumcreateDate: Date;
    description: string;
    songs:Song[];

    constructor(
        title: string = '',
        image: string = '',
        releaseYear: number = new Date().getFullYear(),
        albumcreateDate: Date = new Date(),
        description: string = '',
        songs:Song[]=[]
    ) {
        this.title = title;
        this.image = image;
        this.releaseYear = releaseYear;
        this.albumcreateDate = albumcreateDate;
        this.description = description;
        this.songs=songs;
    }

}
