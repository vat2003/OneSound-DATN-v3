import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListeningStatsService {

  private baseURL = 'http://localhost:8080/api/v1/song'

  constructor(private _httpClient: HttpClient) { }

  incrementPlayCount(songId: number) {
    return this._httpClient.post(`${this.baseURL}/${songId}/play`, null);
  }
}


