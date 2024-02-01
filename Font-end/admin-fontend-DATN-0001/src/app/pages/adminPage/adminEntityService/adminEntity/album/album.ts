export class Album {
    id!: number;
    title: string;
    image: string;
    releaseYear: number;
    albumcreateDate: Date;
    description: string;


    constructor(
        title: string = '',
        image: string = '',
        releaseYear: number = new Date().getFullYear(),
        albumcreateDate: Date = new Date(),
        description: string = ''
    ) {
        this.title = title;
        this.image = image;
        this.releaseYear = releaseYear;
        this.albumcreateDate = albumcreateDate;
        this.description = description;

    }

}
