import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Author } from '../adminEntity/author/author';

interface AuthorResponse {
  content: Author[];
  pageable: any; // Adjust the type as needed
  last: boolean;
  totalPages: number;
  totalElements: number;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = 'http://localhost:8080/api/v1/Author';

  constructor(private http: HttpClient) {}

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}`);
  }

  getCategories(page: number, size: number):Observable<AuthorResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      return this.http.get<AuthorResponse>(`${this.apiUrl}/Authors`, { params });
  }

  getAuthorById(id: number): Observable<Author> {
    return this.http.get<Author>(this.apiUrl + '/' + id);
  }

  getAuthorByName(id: String): Observable<Author> {
    return this.http.get<Author>(this.apiUrl + '/name/' + id);
  }

  getAllAlbumByAuthorByName(title: string, page: number, size: number): Observable<AuthorResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<AuthorResponse>(`${this.apiUrl}/getAuthorByName/${title}`, { params });
    // Giả sử bạn có một endpoint /search trong API để thực hiện tìm kiếm theo tên
  }


  createAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(`${this.apiUrl}`, author);
  }

  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.http.put<Author>(this.apiUrl + '/' + id, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}
