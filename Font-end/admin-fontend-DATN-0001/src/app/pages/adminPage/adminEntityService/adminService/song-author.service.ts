import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SongAuthor } from '../adminEntity/song/songAuthor';

@Injectable({
  providedIn: 'root'
})
export class SongAuthorService {
  private baseURL = 'http://localhost:8080/api/v1/SongAuthor';

  constructor(private httpClient: HttpClient) { }

  // createSongAuthor(singerId: number, albumId: number): Observable<SongAuthor> {
  //   const body = { singerId, albumId };
  //   return this.httpClient.post<SongAuthor>(`${this.baseURL}/create`, body);
  // }

  getAllAuthorBySong(id:number):Observable<any[]> {
    return this.httpClient.get<SongAuthor[]>(`${this.baseURL}/get-by-song/${id}`);
  }

  createSongAuthor(songId: number, authorId: number): Observable<Object> {
    const body = { songId, authorId };
    return this.httpClient.post(`${this.baseURL}/create`, body);
  }

  deleteSongAuthor(albumId: number): Observable<Object> {

    return this.httpClient.delete(`${this.baseURL}/delete/${albumId}`);
  }

  deleteAllSongAuthorByGenreId(albumId: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/delete-by-author/${albumId}`);
  }
  deleteAllSongAuthorBySongId(albumId: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/delete-by-song/${albumId}`);
  }
}
