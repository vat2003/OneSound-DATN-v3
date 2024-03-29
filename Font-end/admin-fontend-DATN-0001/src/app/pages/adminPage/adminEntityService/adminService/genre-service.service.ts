import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../adminEntity/genre/genre';
import { validate } from 'class-validator';
import { of } from 'rxjs';
import { log } from 'console';
interface GenreResponse {
  content: Genre[];
  pageable: any; // Adjust the type as needed
  last: boolean;
  totalPages: number;
  totalElements: number;
  // Add other properties as needed
}
@Injectable({
  providedIn: 'root',
})
export class GenreServiceService {
  private baseUrl = 'http://localhost:8080/api/v1/Genre';
  private apiUpdateActive = `${this.baseUrl}/UpdateActive`;

  constructor(private httpClient: HttpClient) {
  }

  getAllGenres(): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>(`${this.baseUrl}`);
  }

  getAllGenresByName(name: string): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>(`${this.baseUrl}/name/${name}`);
  }

  getListGenres(page: number, size: number): Observable<GenreResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<GenreResponse>(`${this.baseUrl}/Genree`, {
      params,
    });
  }

  // In GenreService
  createGenre(genre: Genre): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, genre);
  }

  getGenre(id: number): Observable<Genre> {
    return this.httpClient.get<Genre>(`${this.baseUrl}/${id}`);
  }

  updateGenre(id: number, Genre: Genre): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, Genre);
  }

  UpdateActive(id: number, accouGenrent: Genre): Observable<Object> {
    return this.httpClient.put<Genre>(`${this.apiUpdateActive}/${id}`, accouGenrent);
  }


  deleteGenre(id: number): Observable<Object> {
    console.log(`${this.baseUrl}/${id}`);
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
