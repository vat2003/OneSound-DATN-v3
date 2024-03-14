import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Playlist} from "../adminEntity/Playlist/Playlist";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class playlistService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {
  }

  getByUser(_account: any): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/Playlist/user/${_account}`);
  }

  getAllPlaylist(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiUrl + '/Playlist');
  }

  createPlaylist(Playlist: any): Observable<Playlist> {
    debugger
    return this.http.post<Playlist>(`${this.apiUrl}/Playlist`, Playlist);
  }


}

