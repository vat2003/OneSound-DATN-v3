import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {accountServiceService} from "../adminEntityService/adminService/account-service.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {account} from "../adminEntityService/adminEntity/account/account";
import {login} from "../adminEntityService/adminEntity/DTO/login";
import {error} from "console";
import {TokenService} from "../adminEntityService/adminService/token.service";
import {LoginResponse} from "../adminEntityService/adminEntity/utils/login.response";
import {NgToastModule, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-changepass2',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    NgToastModule
  ],
  templateUrl: './changepass2.component.html',
  styleUrl: './changepass2.component.scss'
})
export class Changepass2Component implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm;
  password!: string;
  currentpassword!: string;
  retypePassword!: string;
  userEmail!: string;
  showRePassword = false;
  showPassword = false;
  showCurrentPassword = false;
  account!: account;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { acc: account },
              private userService: accountServiceService,
              private toast: NgToastService,
  ) {
    this.account = data.acc;
  }


  toggleShowRePassword() {
    this.showRePassword = !this.showRePassword;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }


  changePassFunc(login: any) {
    this.userService.HamDoiMatKhauCuaQuenMatKhau(login.email, login).subscribe({
      next: (response: any) => {
        // alert("Change successful");
        this.toast.success({detail: 'Message', summary: 'Password has been changed!', duration: 5000});
        this.currentpassword = '';
        this.password = '';
        this.retypePassword = '';
      },
      complete: () => {
      },
      error: (error: any) => {
        alert("Failed" + error);
      }
    });
  }

  checkCurrentPass() {
    var login: login = {
      email: this.account.email.toString(),
      password: this.currentpassword,
    };

    this.userService.login(login).subscribe({
      next: (response: LoginResponse) => {
        login.password = this.password;
        this.changePassFunc(login);
      },
      error: (error) => {
        console.error(error);
        // alert('Wrong password, please check again');
        this.toast.warning({
          detail: 'Warning Message',
          summary: 'Wrong current password, please check again',
          duration: 5000
        });

      }
    });
  }

  ngOnInit(): void {
    console.log(this.account);
  }

  changepass() {
    if (!this.currentpassword) {
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'Please enter current password.',
        duration: 5000
      });
      return;
    }
    if (!this.password || !this.retypePassword) {
      // alert("Please enter both password and retype password.");
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'Please enter both password and retype password.',
        duration: 5000
      });
      return;
    }

    if (this.password !== this.retypePassword) {
      // alert("Passwords do not match.");
      this.toast.warning({detail: 'Warning Message', summary: 'Passwords do not match.', duration: 5000});
      return;
    }

    this.checkCurrentPass();

  }
}
