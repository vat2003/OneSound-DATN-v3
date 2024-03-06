import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeApiSService {
  private apiKey = 'AIzaSyBFAwfG8w01MikmR1RQCdfusLN-aHuh3CE';
  // private apiKey = '';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {
  }

  searchVideos(query: string): Observable<any> {
    const params = {
      key: this.apiKey,
      type: 'video',
      part: 'snippet',
      maxResults: 6,
      topicIds: '/m/04rlf',
      videoCaption: 'closedCaption',
      q: query,
    };
    return this.http.get(this.apiUrl, {params});
  }
}
