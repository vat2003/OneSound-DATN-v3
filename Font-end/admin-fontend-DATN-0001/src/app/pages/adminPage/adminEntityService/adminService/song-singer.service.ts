import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SongSinger } from '../adminEntity/song/songSinger';

@Injectable({
  providedIn: 'root'
})
export class SongSingerService {

  private baseURL = 'http://localhost:8080/api/v1/SongSinger';

  constructor(private httpClient: HttpClient) { }

  // createSongSinger(singerId: number, albumId: number): Observable<SongSinger> {
  //   const body = { singerId, albumId };
  //   return this.httpClient.post<SongSinger>(`${this.baseURL}/create`, body);
  // }

  getAllSingerBySong(id:number):Observable<SongSinger[]> {
    return this.httpClient.get<SongSinger[]>(`${this.baseURL}/get-by-song/${id}`);
  }

  createSongSinger(singerId: number, albumId: number): Observable<Object> {
    const body = { singerId, albumId };
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
