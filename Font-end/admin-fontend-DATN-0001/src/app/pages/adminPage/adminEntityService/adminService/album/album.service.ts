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

  getAllAlbumNormal(): Observable<Album[]> {
    return this.httpClient.get<Album[]>(`${this.baseURL}`);
  }

  getAllAlbumsByName(name: string): Observable<Album[]> {
    return this.httpClient.get<Album[]>(`${this.baseURL}/name/${name}`);
  }

  ///album/name/{name}

  getAllAlbumInactivel(): Observable<Album[]> {
    return this.httpClient.get<Album[]>(`${this.baseURL}/getAllInactive`);
  }



  // getAllAlbumsByName(name: string): Observable<Album> {
  //   return this.httpClient.get<Album>(this.baseURL + '/name/' + name);
  // }

  getAllAlbumByAlbumTitle(title: string, page: number, size: number): Observable<AlbumResponse> {
    const params = new HttpParams()
      .set('title', title.toString())
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<AlbumResponse>(`${this.baseURL}/getAlbumByTitle`, { params });
    // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  }

  createAlbum(album: Album): Observable<Object> {

    return this.httpClient.post(`${this.baseURL}/create`, album);
  }

  updateAlbum(id: number, album: Album): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/update/${id}`, album);
  }

  deleteAlbum(id: number): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/inactive/${id}`, null);
  }

  restoreAlbum(id: number): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/restore/${id}`, null);
  }

  getAlbumById(id: number): Observable<Album> {
    return this.httpClient.get<Album>(`${this.baseURL}/getbyid/${id}`);
  }
}
