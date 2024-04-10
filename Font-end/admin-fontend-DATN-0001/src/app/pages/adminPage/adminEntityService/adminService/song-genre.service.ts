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



  getAllGenreBySong(id:number):Observable<any[]> {
    return this.httpClient.get<SongGenre[]>(`${this.baseURL}/get-by-song/${id}`);
  }

  getAllSongByGenre(id:number):Observable<any[]> {
    return this.httpClient.get<SongGenre[]>(`${this.baseURL}/get-by-genre/${id}`);
  }

  createSongGenre(songId: number, genreId: number): Observable<Object> {
    const body = { songId, genreId };
    return this.httpClient.post(`${this.baseURL}/create`, body);
  }

  updateSongGenre(songId: number, genreId: number): Observable<Object> {
    const body = { songId, genreId };
    return this.httpClient.put(`${this.baseURL}/update`, body);
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
