import { Injectable } from '@angular/core';
import { SingerAlbum } from '../../adminEntity/singerAlbum/singer-album';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SingerAlbumService {

  private baseURL = 'http://localhost:8080/api/v1/singerAlbum';

  constructor(private httpClient: HttpClient) { }

  // createSingerAlbum(singerId: number, albumId: number): Observable<SingerAlbum> {
  //   const body = { singerId, albumId };
  //   return this.httpClient.post<SingerAlbum>(`${this.baseURL}/create`, body);
  // }

  createSingerAlbum(singerId: number, albumId: number): Observable<Object> {
    const body = { singerId, albumId };
    return this.httpClient.post(`${this.baseURL}/create`, body);
  }


}
