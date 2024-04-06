import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment-service/comment.service';
import { Component, Inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-test-comment',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './test-comment.component.html',
  styleUrl: './test-comment.component.scss',
})
export class TestCommentComponent implements OnInit {
  commentsWithReplies!: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { song: any },
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loaddata();
    alert(this.data.song.id);
  }

  loaddata() {
    this.commentService.getCommentsWithRepliesSong(23).subscribe((comments) => {
      this.commentsWithReplies = comments;
      console.log('comment', this.commentsWithReplies);
    });
  }
  deleteComment(comment: any) {
    // alert(comment.id + '   ' + comment.user.id);
    this.commentService
      .deleteCommentSong(comment.id, comment.user.id)
      .subscribe((data) => {});
    this.loaddata();
  }

  addCmt(event: Event, repCommentId: number | null) {
    const target = event.target as HTMLInputElement;
    const textcontent = target.value;

    const comment = {
      accountId: 32,
      songId: 23,
      text: textcontent,
      active: true,
      repCommentId: repCommentId,
    };

    this.commentService.addCommentSong(comment, 23, 32).subscribe((data) => {});
    this.loaddata();
  }
  reply() {}

  test(event: Event) {
    const target = event.target as HTMLInputElement;
    const textcontent = target.value;
    alert(textcontent);
  }
}
