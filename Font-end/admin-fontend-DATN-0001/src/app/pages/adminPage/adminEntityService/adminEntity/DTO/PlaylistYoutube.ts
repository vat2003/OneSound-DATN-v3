
import { Playlist } from "../../../PlaylistSong/Playlist";
import { Youtube } from "./youtube";

export class PlaylistYoutube {
    PlaylistYoutubeId: number;
    Youtube?: Youtube;
    playlist?: Playlist;

    constructor(PlaylistYoutubeId: number, Youtube?: Youtube, playlist?: Playlist) {
        this.PlaylistYoutubeId = PlaylistYoutubeId;
        this.Youtube = Youtube;
        this.playlist = playlist;
    }            
}