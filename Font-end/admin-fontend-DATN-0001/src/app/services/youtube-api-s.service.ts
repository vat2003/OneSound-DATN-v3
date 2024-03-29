import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeApiSService {
  private apiKey = 'AIzaSyC1wy30fMi4JWX-TAgRuGQoo6Y-Te3ilqo';
  // private apiKey = 'AIzaSyBrOM6lplozKtRo-oM74scMxuSycjydxsw';
  // private apiKey = '';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  searchVideos(query: string): Observable<any> {
    const params = {
      key: this.apiKey,
      type: 'video',
      part: 'snippet',
      maxResults: 15,
      topicIds: '/m/04rlf',
      videoCaption: 'closedCaption',
      q: query,
    };
    return this.http.get(this.apiUrl, { params });
  }
}
