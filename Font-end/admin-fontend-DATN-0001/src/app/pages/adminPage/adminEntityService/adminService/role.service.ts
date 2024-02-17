import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Role {
  id: number;
  // ...các thuộc tính khác của Role
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {

    return this.http.get<Role[]>(this.apiUrl + '/Role');
  }



  getAllRolesPages(pageable: any): Observable<any> { // Tùy chỉnh kiểu dữ liệu trả về theo Pageable
    return this.http.get<any>(this.apiUrl + '/Role', { params: pageable });
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(this.apiUrl + `/${id}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(this.apiUrl + `/${id}`, role);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/${id}`);
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
