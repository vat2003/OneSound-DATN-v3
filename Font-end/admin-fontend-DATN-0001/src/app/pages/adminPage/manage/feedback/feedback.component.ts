import {Component} from '@angular/core';
import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {Feedback} from '../../adminEntityService/adminEntity/DTO/Feedback';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

  email: string = '';
  reason: string = ''
  feedbackContent: string = '';

  constructor(
    private userService: accountServiceService,
  ) {
  }

  submitFeedback(): void {
    debugger
    alert(this.email)
    alert(this.reason)
    alert(this.feedbackContent)
    debugger
    var feedbackInstance: Feedback = {

      email: this.email,
      reason: this.reason,
      content: this.feedbackContent, // fix: use feedbackContent instead of content
    };
    debugger
    this.userService.EmailFeedBack(feedbackInstance).subscribe(
      async (data) => {
        alert("thành công");
        console.log('data feed', data)
      },
      (error) => {
        debugger
        alert(error)

      }
    );
  }
}
