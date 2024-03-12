import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SongGenre } from '../adminEntity/song/songGenre';

@Injectable({
  providedIn: 'root'
})
export class SongGenreService {

  private baseURL = 'http://localhost:8080/api/v1/SongGenre';

  constructor(private httpClient: HttpClient) { }

  // createSongGenre(GenreId: number, albumId: number): Observable<SongGenre> {
  //   const body = { GenreId, albumId };
  //   return this.httpClient.post<SongGenre>(`${this.baseURL}/create`, body);
  // }

  getAllGenreBySong(id:number):Observable<any[]> {
    return this.httpClient.get<SongGenre[]>(`${this.baseURL}/get-by-song/${id}`);
  }

  createSongGenre(songId: number, genreId: number): Observable<Object> {
    const body = { songId, genreId };
    return this.httpClient.post(`${this.baseURL}/create`, body);
  }

  deleteSongGenre(albumId: number): Observable<Object> {

    return this.httpClient.delete(`${this.baseURL}/delete/${albumId}`);
  }

  deleteAllSongGenreByGenreId(albumId: number): Observable<Object> {

    return this.httpClient.delete(`${this.baseURL}/delete-by-Genre/${albumId}`);
  }
  deleteAllSongGenreBySongId(albumId: number): Observable<Object> {

    return this.httpClient.delete(`${this.baseURL}/delete-by-song/${albumId}`);
  }
}
