import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SongSinger } from '../adminEntity/song/songSinger';
import { SongSinger1 } from '../adminEntity/song/SongSinger1';
import { Singer } from '../adminEntity/singer/singer';

@Injectable({
  providedIn: 'root'
})
export class SongSingerService {

  private baseURL = 'http://localhost:8080/api/v1/SongSinger';
  private baseURL1 = 'http://localhost:8080/api/v1/SongSinger';

  constructor(private httpClient: HttpClient) { }



  getsinger(id:number): Observable<Singer> {
    return this.httpClient.get<Singer>(`${this.baseURL1}/${id}`);
  }


  getAllSingerBySong(id:number):Observable<any[]> {
    return this.httpClient.get<SongSinger[]>(`${this.baseURL}/get-by-song/${id}`);
  }

  getAllSongBySinger(id:number):Observable<any[]> {
    return this.httpClient.get<SongSinger[]>(`${this.baseURL}/get-by-singer/${id}`);
  }

  createSongSinger(songId: number, singerId: number): Observable<Object> {
    const body = { songId, singerId };
    return this.httpClient.post(`${this.baseURL}/create`, body);
  }

  deleteSongSinger(albumId: number): Observable<Object> {

    return this.httpClient.delete(`${this.baseURL}/delete/${albumId}`);
  }

  deleteAllSongSingerBySingerId(albumId: number): Observable<Object> {

    return this.httpClient.delete(`${this.baseURL}/delete-by-singer/${albumId}`);
  }
  deleteAllSongSingerBySongId(albumId: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/delete-by-song/${albumId}`);
  }
}
