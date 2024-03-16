import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Playlist } from "../../PlaylistSong/Playlist";
import { Observable } from "rxjs";
import { PlaylistSong } from "../../PlaylistSong/PlaylistSong";

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
        return this.http.get<PlaylistSong[]>(`${this.apiUrl}/PlaylistSong/playlist/${playlistId}`);
      }

      findSongInPlaylist(playlistId: number, songId: number): Observable<PlaylistSong> {
        return this.http.get<PlaylistSong>(`${this.apiUrl}/PlaylistSong/${playlistId}/${songId}`);
      }

      removeSongFromPlaylist(playlistId: number, songId: number): Observable<any> {
                
        return this.http.delete(`${this.apiUrl}/PlaylistSong/${playlistId}/${songId}`);
      }

      removePlaylist(playlistId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/Playlist/${playlistId}`);
      }
}

