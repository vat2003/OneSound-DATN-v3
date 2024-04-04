import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment-service/comment.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import e from 'express';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { log } from 'console';

@Component({
  selector: 'app-comment-song',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './comment-song.component.html',
  styleUrl: './comment-song.component.scss',
})
export class CommentSongComponent implements OnInit {
  @ViewChild('inptextarea') inptextarea!: ElementRef;

  acc?: account | null;

  repComentUser: string = '';
  repCommentId: number | null = null;
  commentsWithReplies!: any[];

  textareaValue: string = '';
  checkEditCmt!: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { song: any },
    private commentService: CommentService,
    private userService: accountServiceService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.loaddata();
    alert(this.commentsWithReplies.length);
    // alert(this.data.song.id);
  }
  loaddata() {
    this.commentService.getCommentsWithReplies(23).subscribe((comments) => {
      this.commentsWithReplies = comments;
      console.log('comment', this.commentsWithReplies);
      this.cdRef.detectChanges(); // Bắt buộc Angular cập nhật giao diện
    });
  }
  deleteComment(comment: any) {
    // alert(comment.id + '   ' + comment.user.id);
    this.commentService
      .deleteComment(comment.id, comment.user.id)
      .subscribe((data) => {});
    this.loaddata();
  }

  send() {
    if (this.checkEditCmt) {
      this.addCmt();
    } else {
      // this.editComment();
    }
  }
  addCmt() {
    if (this.repCommentId != null) {
      this.textareaValue = this.textareaValue.substring(
        this.repComentUser.length + 1
      );
    }

    if (this.acc && this.acc.id && this.textareaValue.length > 0) {
      const comment = {
        accountId: this.acc?.id,
        songId: 23,
        text: this.textareaValue,
        active: true,
        repCommentId: this.repCommentId,
      };

      this.commentService
        .addComment(comment, 23, this.acc?.id)
        .subscribe((data) => {});

      this.loaddata();
      this.reset();
    } else {
      console.error(
        'Không thể thêm bình luận vì acc không tồn tại hoặc không có id.'
      );
    }
  }
  editComment(oldCmt: any) {
    const newCmt = {
      accountId: oldCmt.user.id,
      songId: oldCmt.song.id,
      text: this.textareaValue,
      active: true,
      repCommentId: null,
    };

    this.commentService.editComment(newCmt, oldCmt).subscribe((data) => {});
  }
  reply(cmtReply: any) {
    this.textareaValue = '';
    this.repCommentId = cmtReply.id;
    this.repComentUser = cmtReply.user.fullname;
    this.textareaValue += `${this.repComentUser} `;
    this.inptextarea.nativeElement.focus();
  }

  reset() {
    this.repCommentId = null;
    this.textareaValue = '';
    this.commentsWithReplies.forEach((cmt) => {
      cmt.showOptions = false;
    });
  }
  toggleOptions(comment: any) {
    comment.showOptions = !comment.showOptions;
  }
}
