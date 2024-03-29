import { Song } from "../song/song";


export class Listens {
    id!: number;
    listens: number;
    dateLis: Date;
    song: Song
    // private Long id;
    // private Long listens;
    // @Temporal(TemporalType.DATE)
    // private Date dateLis;

    // @ManyToOne
    // @JoinColumn(name = "songId")
    // private Song song;
    constructor(data: any) {
        this.listens = data.listen;
        this.dateLis = data.dateLis;
        this.song = data.song;
    }
}
