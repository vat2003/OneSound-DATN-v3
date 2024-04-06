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
import { error, log } from 'console';
import { formatDistanceToNow } from 'date-fns';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';

@Component({
  selector: 'app-comment-youtube',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],

  templateUrl: './comment-youtube.component.html',
  styleUrl: './comment-youtube.component.scss',
})
export class CommentYoutubeComponent implements OnInit {
  acc?: account | null;

  repComentUser: string = '';
  repCommentId: number | null = null;
  commentsWithReplies!: any[];
  oldEditCmt: any;

  textareaValue: string = '';
  checkEditCmt!: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { song: any },
    private commentService: CommentService,
    private userService: accountServiceService,
    private cdRef: ChangeDetectorRef,
    private firebaseStorage: FirebaseStorageCrudService
  ) {}

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.loaddata();

    // alert(this.data.song.id.videoId);
  }
  setTimeAgo(comment: any): any {
    const timeAgo = this.getTimeAgo(comment.likeDate);
    const updatedComment: any = {
      ...comment,
      likeDate: new Date(comment.likeDate),
      timeAgo: timeAgo,
    };

    if (updatedComment.replies) {
      updatedComment.replies = updatedComment.replies.map((reply: any) =>
        this.setTimeAgo(reply)
      );
    }

    return updatedComment;
  }
  getTimeAgo(date: Date): string {
    return formatDistanceToNow(new Date(date));
  }
  loaddata() {
    this.commentService
      .getCommentsWithRepliesYT(this.data.song.id.videoId)
      .subscribe((comments) => {
        this.commentsWithReplies = comments;

        this.commentsWithReplies = this.commentsWithReplies.map((comment) => {
          const updatedComment = this.setTimeAgo(comment);
          return updatedComment;
        });

        console.log('comment', this.commentsWithReplies);
        // alert('comment' + this.commentsWithReplies.length);
        this.cdRef.detectChanges();
      });
  }

  deleteComment(comment: any) {
    // alert(comment.id + '   ' + comment.user.id);
    this.commentService
      .deleteCommentYT(comment.id, comment.user.id)
      .subscribe((data) => {
        this.loaddata();
        this.reset();
      });
  }

  addCmt() {
    if (this.acc && this.acc.id && this.textareaValue.length > 0) {
      const comment = {
        accountId: this.acc?.id,
        youtube_id: this.data.song.id.videoId,
        text: this.textareaValue,
        active: true,
        repCommentId: null,
      };

      this.commentService
        .addCommentYT(comment, this.data.song.id.videoId, this.acc?.id)
        .subscribe((data) => {
          this.loaddata();
          this.reset();
        });
    } else {
      console.error(
        'Không thể thêm bình luận vì acc không tồn tại hoặc không có id.'
      );
    }
  }
  editComment(oldCmt: any) {
    oldCmt.edit = !oldCmt.edit;
  }

  sendEditComment(oldCmt: any, event: Event) {
    let target = event.target;
    let textEditCmt = '';
    if (target instanceof HTMLElement) {
      let textarea = document.getElementById(
        `${oldCmt.id}`
      ) as HTMLTextAreaElement | null;
      if (textarea) {
        textEditCmt = textarea.value;
        // alert(textareaValue);
      }
    }

    const newCmt = {
      accountId: oldCmt.user.id,
      youtube_id: oldCmt.youtube.id,
      text: textEditCmt,
      active: true,
    };
    console.log('newCmtnewCmtnewCmt', newCmt);

    this.commentService.editCommentYT(newCmt, oldCmt).subscribe((data) => {
      this.loaddata();
      this.reset();
    });

    // this.reset();
  }
  reply(cmtReply: any) {
    cmtReply.reply = !cmtReply.reply;
  }

  reset() {
    this.repCommentId = null;
    this.textareaValue = '';
    this.commentsWithReplies.forEach((cmt) => {
      cmt.showOptions = false;
      cmt.edit = false;
      cmt.reply = false;
    });
  }
  hideAllOptions() {
    //bậc 1
    this.commentsWithReplies.forEach((cmt1) => {
      cmt1.showOptions = false;

      //bậc 2
      if (cmt1.replies) {
        cmt1.replies.forEach((cmt2: { showOptions: boolean; replies: any }) => {
          cmt2.showOptions = false;

          //bậc 3
          if (cmt2.replies) {
            cmt2.replies.forEach(
              (cmt3: { showOptions: boolean; replies: any }) => {
                cmt3.showOptions = false;
              }
            );
          }
        });
      }
    });
  }
  toggleOptions(comment: any) {
    if (comment.showOptions) {
      comment.showOptions = false;
    } else {
      this.hideAllOptions();
      comment.showOptions = true;
    }
  }

  sendReply(event: Event, cmt: any, repCmtId: number) {
    let target = event.target;
    let textareaReplyValue = '';
    if (target instanceof HTMLElement) {
      const textareaReply = target
        .closest('.reply-content')
        ?.querySelector('.inptextarea');
      if (textareaReply instanceof HTMLTextAreaElement) {
        textareaReplyValue = textareaReply.value;
        // alert(textareaReplyValue);
      }
      //   else {
      //     alert('Textarea not found!');
      //   }
      // } else {
      //   alert('Event target is not an HTMLElement!');
    }

    if (this.acc && this.acc.id && textareaReplyValue.length > 0) {
      const comment = {
        accountId: this.acc?.id,
        youtube_id: this.data.song.id.videoId,
        text: textareaReplyValue,
        active: true,
        repCommentId: repCmtId,
      };

      this.commentService
        .addCommentYT(comment, this.data.song.id.videoId, this.acc?.id)
        .subscribe((data) => {
          this.loaddata();
          this.reset();
        });
    } else {
      console.error(
        'Không thể thêm bình luận vì acc không tồn tại hoặc không có id.'
      );
    }
  }
}
