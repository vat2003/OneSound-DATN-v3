import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountUserByDate } from '../../adminEntity/DTO/count-user-by-date';
import { account } from '../../adminEntity/account/account';

@Injectable({
  providedIn: 'root'
})
export class StaticticalService {


  private baseURL = 'http://localhost:8080/api/v1'
  constructor(private httpClient: HttpClient) { }

  getQuantityUser(sort: number): Observable<CountUserByDate[]> {
    return this.httpClient.get<CountUserByDate[]>(`${this.baseURL}/statictical/get-user-by-date/${sort}`);
  }

  getQuantityUserById(sort: number): Observable<CountUserByDate[]> {
    return this.httpClient.get<CountUserByDate[]>(`${this.baseURL}/statictical/get-user-by-id/${sort}`);
  }

  getAllUserByDate(date: Date): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-create-date/${date}`);
  }

  getAllUserByDateLong(date: number): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-create-date/${date}`);
  }

}
