import {Component} from '@angular/core';
import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {Feedback} from '../../adminEntityService/adminEntity/DTO/Feedback';
import {FormsModule} from '@angular/forms';
import {NgToastService} from "ng-angular-popup";

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
    private userService: accountServiceService, private toast: NgToastService,
  ) {
  }

  submitFeedback(): void {
    var feedbackInstance: Feedback = {

      email: this.email,
      reason: this.reason,
      content: this.feedbackContent, // fix: use feedbackContent instead of content
    };
    debugger
    this.userService.EmailFeedBack(feedbackInstance).subscribe(
      async (data) => {
        this.toast.success({detail: 'Success Message', summary: 'Sending Mail successfully', duration: 3000});
        alert('Sending Mail successfully')
        console.log('data feed', data)
      },
      (error) => {
        console.log(error);
        this.toast.success({detail: 'Error Message', summary: 'Sending Mail failed', duration: 3000});
        alert('Sending Mail failed')

      }
    );
  }
}
