import { Song } from "../adminEntityService/adminEntity/song/song";
import { Playlist } from './Playlist';

export class PlaylistSong {
    playlistId: number;
    songId: number;
    song?: Song;
    playlist?: Playlist;

    constructor(playlistId: number, songId: number, song?: Song, playlist?: Playlist) {
        this.playlistId = playlistId;
        this.songId = songId;
        this.song = song;
        this.playlist = playlist;
    }
}
