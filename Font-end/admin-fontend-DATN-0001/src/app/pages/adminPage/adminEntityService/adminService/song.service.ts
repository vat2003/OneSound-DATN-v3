import { Injectable } from '@angular/core';
import { Song } from '../adminEntity/song/song';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
interface SongResponse {
  content: Song[];
  pageable: any; // Adjust the type as needed
  last: boolean;
  totalPages: number;
  totalElements: number;
  // Add other properties as needed
}
@Injectable({
  providedIn: 'root'
})
export class SongService {
  private baseUrl = 'http://localhost:8080/api/v1/Song';

  constructor(private httpClient: HttpClient) { }

  getAllSongs(): Observable<Song[]> {
    return this.httpClient.get<Song[]>(`${this.baseUrl}`);
  }

  getAllSongsByName(name: string): Observable<Song> {
    const params = new HttpParams().set('name', name); // Thêm tham số truy vấn 'name'

    return this.httpClient.get<Song>(`${this.baseUrl}/get-Song-by-name`, { params });
    // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  }

  getAllSongsByAlbumId(id: number): Observable<Song[]> {

    return this.httpClient.get<Song[]>(`${this.baseUrl}/getAllByAlbumId/${id}`);
    // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  }

  getCategories(page: number, size: number): Observable<SongResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<SongResponse>(`${this.baseUrl}/Songs`, { params });
  }


  createSong(Song: Song): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, Song);
  }

  getSongById(id: number): Observable<Song> {
    return this.httpClient.get<Song>(`${this.baseUrl}/${id}`);
  }

  updateSong(id: number, Song: Song): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, Song);
  }

  deleteSong(id: number): Observable<Object> {
    console.log(`${this.baseUrl}/${id}`);
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
