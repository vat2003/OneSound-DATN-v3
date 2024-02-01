import { Injectable } from '@angular/core';
import { SingerAlbum } from '../../adminEntity/singerAlbum/singer-album';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SingerAlbumService {

  private baseURL = 'http://localhost:8080/api/v1/singerAlbum';

  constructor(private htppClient: HttpClient) { }

  createSingerAlbum(singerId: number, albumId: number): Observable<SingerAlbum> {

    return this.htppClient.post<SingerAlbum>(`${this.baseURL}/create`, { singerId, albumId });
  }

}
