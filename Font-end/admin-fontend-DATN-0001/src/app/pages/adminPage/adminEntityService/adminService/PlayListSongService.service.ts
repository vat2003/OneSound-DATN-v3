import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Playlist } from "../adminEntity/Playlist/Playlist";
import { Observable } from "rxjs";
import { PlaylistSong } from "../adminEntity/Playlist/PlaylistSong";

@Injectable({
    providedIn: 'root'
  })
export class PlayListSongService {
    private apiUrl = 'http://localhost:8080/api/v1';
    constructor(private http: HttpClient) { }


    getAllSongToPlaylist(): Observable<PlaylistSong[]> {
        return this.http.get<PlaylistSong[]>(this.apiUrl + '/PlaylistSong');
    }

    addSongToPlaylist(playlistId: number, songId: number): Observable<any> {
        
        const requestBody = {
          playlist: playlistId,
          song: songId
        };
    
        return this.http.post(`${this.apiUrl}/PlaylistSong`, requestBody);
      }

      getAllSongsInPlaylist(playlistId: number): Observable<PlaylistSong[]> {
        debugger
        return this.http.get<PlaylistSong[]>(`${this.apiUrl}/PlaylistSong/playlist/${playlistId}`);
      }
    
   
}

