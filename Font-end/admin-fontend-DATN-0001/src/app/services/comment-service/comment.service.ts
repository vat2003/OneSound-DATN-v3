import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private urlCommentSongBase = 'http://localhost:8080/api/v1/comments';
  private urlCommentYTBase = 'http://localhost:8080/api/v1/Comemtyt';
  constructor(private httpClient: HttpClient) {}

  //Cmt song ----------------------------------------------------
  getCommentsWithRepliesSong(songId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${this.urlCommentSongBase}/${songId}/with-replies`
    );
  }
  addCommentSong(
    comment: any,
    songId: number,
    userId: number
  ): Observable<Object> {
    return this.httpClient.post(
      `${this.urlCommentSongBase}?songId=${songId}&userId=${userId}`,
      comment
    );
  }
  editCommentSong(newCmt: any, oldCmt: any): Observable<Object> {
    return this.httpClient.put(
      `${this.urlCommentSongBase}/${oldCmt.id}?songId=${oldCmt.song.id}&userId=${oldCmt.user.id}`,
      newCmt
    );
  }
  deleteCommentSong(commentId: number, userId: number): Observable<Object> {
    return this.httpClient.delete(
      `${this.urlCommentSongBase}/byidandcommentid/${commentId}/${userId}`
    );
  }

  //Cmt YT ----------------------------------------------------
  getCommentsWithRepliesYT(songId: string): Observable<any[]> {
    console.log(`${this.urlCommentYTBase}/${songId}/with-replies`);
    return this.httpClient.get<any[]>(
      `${this.urlCommentYTBase}/${songId}/with-replies`
    );
  }
  addCommentYT(
    comment: any,
    songId: string,
    userId: number
  ): Observable<Object> {
    return this.httpClient.post(
      `${this.urlCommentYTBase}?youtube_id=${songId}&userId=${userId}`,
      comment
    );
  }
  editCommentYT(newCmt: any, oldCmt: any): Observable<Object> {
    return this.httpClient.put(
      `${this.urlCommentYTBase}/${oldCmt.id}?youtube_id=${oldCmt.youtube.id}&userId=${oldCmt.user.id}`,
      newCmt
    );
  }
  deleteCommentYT(commentId: number, userId: number): Observable<Object> {
    return this.httpClient.delete(
      `${this.urlCommentYTBase}/byidandcommentid/${commentId}/${userId}`
    );
  }
}
