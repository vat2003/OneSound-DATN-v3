import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Playlist } from "../../PlaylistSong/Playlist";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class playlistService {
  private apiUrl = 'http://localhost:8080/api/v1';

    getAllPlaylist(): Observable<Playlist[]> {
        return this.http.get<Playlist[]>(this.apiUrl + '/Playlist');
    }

    createPlaylist(Playlist: any): Observable<Playlist> {
      debugger
      return this.http.post<Playlist>(`${this.apiUrl}/Playlist`, Playlist);
  }

  getPlaylistsByUserId(userId: number): Observable<Playlist[]> {
      return this.http.get<Playlist[]>(`${this.apiUrl}/Playlist/user/${userId}`);
    }

    getPlaylistByName(name: string): Observable<Playlist> {
      return this.http.get<Playlist>(`${this.apiUrl}/Playlist/${name}`);
    }
    getPlaylistByid(id: number): Observable<Playlist> {
      return this.http.get<Playlist>(`${this.apiUrl}/Playlist/id/${id}`);
    }
  constructor(private http: HttpClient) {
  }

  getByUser(_account: any): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/Playlist/user/${_account}`);
  }




}

