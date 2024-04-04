import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private urlCommentBase = 'http://localhost:8080/api/v1/comments';
  constructor(private httpClient: HttpClient) {}
  getCommentsWithReplies(songId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${this.urlCommentBase}/${songId}/with-replies`
    );
  }
  addComment(comment: any, songId: number, userId: number): Observable<Object> {
    return this.httpClient.post(
      `${this.urlCommentBase}?songId=${songId}&userId=${userId}`,
      comment
    );
  }
  editComment(newCmt: any, oldCmt: any): Observable<Object> {
    return this.httpClient.put(
      `${this.urlCommentBase}/${oldCmt.id}?songId=${oldCmt.song.id}&userId=${oldCmt.user.id}`,
      newCmt
    );
  }
  deleteComment(commentId: number, userId: number): Observable<Object> {
    return this.httpClient.delete(
      `${this.urlCommentBase}/byidandcommentid/${commentId}/${userId}`
    );
  }
}
