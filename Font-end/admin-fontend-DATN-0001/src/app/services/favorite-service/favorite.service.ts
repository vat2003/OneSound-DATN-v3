import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteYoutbe } from '../../pages/adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import { Youtube } from '../../pages/adminPage/adminEntityService/adminEntity/youtube-entity/youtube';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private urlFavoriteYoutube = 'http://localhost:8080/api/v1/favoriteYoutube';
  private urlFavoriteSong = 'http://localhost:8080/api/v1/favoriteSong';
  private urlYoutube = 'http://localhost:8080/api/v1/youtube';
  constructor(private httpClient: HttpClient) {}

  getAllFavoriteYoutube(): Observable<FavoriteYoutbe[]> {
    return this.httpClient.get<FavoriteYoutbe[]>(`${this.urlFavoriteYoutube}`);
  }

  createYt(youtube: Youtube): Observable<Object> {
    console.log(youtube);

    return this.httpClient.post(`${this.urlYoutube}`, youtube);
  }

  addFavoriteYoutube(favYT: FavoriteYoutbe): Observable<Object> {
    return this.httpClient.post(`${this.urlFavoriteYoutube}`, favYT);
  }

  deleteFavoriteYoutube(favYT: FavoriteYoutbe): Observable<Object> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: favYT,
    };

    return this.httpClient.delete(`${this.urlFavoriteYoutube}`, options);
  }

  getAllFavYoutubeByUser(userId: number): Observable<FavoriteYoutbe[]> {
    return this.httpClient.get<FavoriteYoutbe[]>(
      `${this.urlFavoriteYoutube}/${userId}`
    );
  }
}
