import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryListensService {

  private baseURL = 'http://localhost:8080/api/v1/listen';

  constructor(private _httpClient: HttpClient) { }

  addHisLis(songId: number, userId: number) {
    return this._httpClient.post(`${this.baseURL}/add/${songId}/${userId}`, null);
  }

  getHisByUserId(userId: number): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.baseURL}/get-by-user-id/${userId}`)
  }


}
