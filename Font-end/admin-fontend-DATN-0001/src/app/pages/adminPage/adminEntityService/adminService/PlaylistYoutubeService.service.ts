import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PlaylistYoutube } from "../adminEntity/DTO/PlaylistYoutube";
import { Youtube } from "../adminEntity/DTO/youtube";

@Injectable({
  providedIn: 'root',
})
export class PlaylistYoutubeService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private urlYoutube = 'http://localhost:8080/api/v1/youtube';

  constructor(private httpClient: HttpClient) {}


  createYt(youtubeId: string): Observable<Object> {
    const requestBody = {
      id: youtubeId  // assuming 'id' is the property in the Youtube model
    };
    return this.httpClient.post(`${this.apiUrl}/youtube`, requestBody);
  }


  getAllPlaylistYoutubes(): Observable<PlaylistYoutube[]> {
    return this.httpClient.get<PlaylistYoutube[]>(`${this.apiUrl}/PlaylistYoutube`);
  }

  findYoutubeInPlaylist(playlistId: number, youtubeId: string): Observable<PlaylistYoutube> {
    return this.httpClient.get<PlaylistYoutube>(`${this.apiUrl}/PlaylistYoutube/${playlistId}/${youtubeId}`);
  }

  addYoutubeToPlaylist(playlistId: number, youtubeId: string): Observable<object> {
    debugger
    const requestBody = {
      
      playlistId: playlistId,
      youtubeId: youtubeId
    };
    debugger
    return this.httpClient.post(`${this.apiUrl}/PlaylistYoutube`, requestBody);
  }

  removeYoutubeFromPlaylist(playlistId: number, youtubeId: string): Observable<object> {
    return this.httpClient.delete(`${this.apiUrl}/PlaylistYoutube/${playlistId}/${youtubeId}`);
  }

  removeAllYoutubesFromPlaylist(playlistId: number): Observable<object> {
    return this.httpClient.delete(`${this.apiUrl}/PlaylistYoutube/${playlistId}`);
  }
}
