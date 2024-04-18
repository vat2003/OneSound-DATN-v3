import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteYoutbe } from '../../pages/adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import { Youtube } from '../../pages/adminPage/adminEntityService/adminEntity/youtube-entity/youtube';
import { FavoriteSong } from '../../pages/adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import { FavoriteAlbum } from '../../pages/adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-album';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private urlFavoriteYoutube = 'http://localhost:8080/api/v1/favoriteYoutube';
  private urlFavoriteSong = 'http://localhost:8080/api/v1/favoriteSong';
  private urlFavoriteAlbum = 'http://localhost:8080/api/v1/favoriteAlbum';
  private urlYoutube = 'http://localhost:8080/api/v1/youtube';
  constructor(private httpClient: HttpClient) {}

  // youtube
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

  //song vật lý -----------------------------------------------------------
  getAllFavoriteSong(): Observable<FavoriteSong[]> {
    return this.httpClient.get<FavoriteSong[]>(`${this.urlFavoriteSong}`);
  }

  addFavoriteSong(favSong: FavoriteSong): Observable<Object> {
    return this.httpClient.post(`${this.urlFavoriteSong}`, favSong);
  }

  deleteFavoriteSong(favSong: FavoriteSong): Observable<Object> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: favSong,
    };

    return this.httpClient.delete(`${this.urlFavoriteSong}`, options);
  }

  getAllFavSongByUser(userId: number): Observable<FavoriteSong[]> {
    return this.httpClient.get<FavoriteSong[]>(
      `${this.urlFavoriteSong}/${userId}`
    );
  }
  getAllFavAlbumByUser(userId: number): Observable<FavoriteSong[]> {
    return this.httpClient.get<FavoriteSong[]>(
      `${this.urlFavoriteAlbum}/${userId}`
    );
  }

  //------------------fav album
  addFavoriteAlbum(favAlbum: FavoriteAlbum): Observable<Object> {
    return this.httpClient.post(`${this.urlFavoriteAlbum}`, favAlbum);
  }
  deleteFavoriteAlbum(favAlbum: FavoriteAlbum): Observable<Object> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: favAlbum,
    };

    return this.httpClient.delete(`${this.urlFavoriteAlbum}`, options);
  }
  isAlbumLikedByUser(accountId: number, albumId: number): Observable<Object> {
    return this.httpClient.get<Object>(
      `${this.urlFavoriteAlbum}/isAlbumLiked/${accountId}/${albumId}`
    );
  }
}
