import { Injectable } from '@angular/core';
import { Album } from '../../adminEntity/album/album';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AlbumResponse {
  content: Album[];
  pageable: any; // Adjust the type as needed
  last: boolean;
  totalPages: number;
  totalElements: number;
  // Add other properties as needed
}
@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseURL = 'http://localhost:8080/api/v1/album'
  constructor(private httpClient: HttpClient) { }

  getAllAlbum(page: number, size: number): Observable<AlbumResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<AlbumResponse>(`${this.baseURL}/getall`, { params });
  }

  createAlbum(album: Album): Observable<Object> {

    return this.httpClient.post(`${this.baseURL}/create`, album);
  }

  updateAlbum(id: number, album: Album): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/update/${id}`, album);
  }

  deleteAlbum(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/delete/${id}`);
  }

  getAlbumById(id: number): Observable<Album> {
    return this.httpClient.get<Album>(`${this.baseURL}/getbyid/${id}`);
  }
}
