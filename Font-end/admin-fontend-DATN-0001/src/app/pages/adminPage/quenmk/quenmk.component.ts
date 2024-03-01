import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import {accountServiceService} from "../adminEntityService/adminService/account-service.service";
import {TokenService} from "../adminEntityService/adminService/token.service";

@Component({
  selector: 'app-quenmk',
  styleUrls: ['./quenmk.component.scss'],
  templateUrl: './quenmk.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
  ],
})
export class QuenmkComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  email: string = '';

  constructor(private router: Router,
              private userService: accountServiceService,
              private tokenService: TokenService,
  ) {
  }

  Quenmk() {
    debugger
    if (!this.email) {
      alert("Please enter email");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email)) {
      alert("Please enter a valid email address");
      return;
    }
    debugger
    this.userService.checkEmailExists(this.email).subscribe({
      next: (emailExists: boolean) => {
        debugger
        if (emailExists) {
          debugger
          this.userService.guimail1(this.email).subscribe({
            next: (response: any) => {

              debugger
              alert("Email sent successfully, please check email to get confirmation code");
            },
            complete: () => {

              debugger
            },
            error: (error: any) => {
              debugger
              alert("Email sending failed");
              console.log(error);
            }
          });
        } else {
          debugger
          alert("Could not find email");

        }
      },
      error: (error: any) => {
        debugger
        console.error("Error checking email existence");
      }
    });


  }


}
