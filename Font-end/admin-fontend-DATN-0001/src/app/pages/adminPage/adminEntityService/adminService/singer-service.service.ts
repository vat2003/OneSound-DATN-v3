import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
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

  getAllemployees(): Observable<Singer[]> {    
    return this.httpClient.get<Singer[]>(`${this.baseUrl}`);
  }

  getCategories(page: number, size: number):Observable<SingerResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());        
      return this.httpClient.get<SingerResponse>(`${this.baseUrl}/Singers`, { params });                   
  }


  createEmployee(Singer: Singer): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, Singer);
  }

  getEmployeeById(id: number): Observable<Singer> {
    return this.httpClient.get<Singer>(`${this.baseUrl}/${id}`);
  }

  updateEmployee(id: number, Singer: Singer): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, Singer);
  }

  deleteEmployee(id: number): Observable<Object> {
    console.log(`${this.baseUrl}/${id}`);
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
