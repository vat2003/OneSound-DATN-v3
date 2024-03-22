import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Singer } from '../adminEntity/singer/singer';
interface SingerResponse {
  content: Singer[];
  pageable: any; // Adjust the type as needed
  last: boolean;
  totalPages: number;
  totalElements: number;
  // Add other properties as needed
}
@Injectable({
  providedIn: 'root'
})



export class SingerService {

  private baseUrl = 'http://localhost:8080/api/v1/Singer';

  constructor(private httpClient: HttpClient) { }

  getAllArtists(): Observable<Singer[]> {
    return this.httpClient.get<Singer[]>(`${this.baseUrl}`);
  }

  getAllArtistsByName(name: string): Observable<Singer> {
    const params = new HttpParams().set('name', name); // Thêm tham số truy vấn 'name'

    return this.httpClient.get<Singer>(`${this.baseUrl}/get-singer-by-name`, { params });
    // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  }

  // getAllArtistsByAlbumId(id: number): Observable<Singer[]> {

  //   return this.httpClient.get<Singer[]>(`${this.baseUrl}/getAllByAlbumId/${id}`);
  //   // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  // }

  getAllArtistActive():Observable<Singer[]>{
    return this.httpClient.get<Singer[]>(`${this.baseUrl}/getAllSingerActive`);
  }

  getAllArtistsByAlbumId(id: number): Observable<Singer[]> {
    return this.httpClient.get<Singer[]>(`${this.baseUrl}/getAllByAlbumId/${id}`);
    // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  }

  getCategories(page: number, size: number): Observable<SingerResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<SingerResponse>(`${this.baseUrl}/Singers`, { params });
  }

  getAllAlbumByAuthorByName(title: string, page: number, size: number): Observable<SingerResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<SingerResponse>(`${this.baseUrl}/getAuthorByName/${title}`, { params });
  }


  createArtist(Singer: Singer): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, Singer);
  }

  getArtistById(id: number): Observable<Singer> {
    return this.httpClient.get<Singer>(`${this.baseUrl}/${id}`);
  }

  updateArtist(id: number, Singer: Singer): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, Singer);
  }

  deleteArtist(id: number): Observable<Object> {
    console.log(`${this.baseUrl}/${id}`);
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
