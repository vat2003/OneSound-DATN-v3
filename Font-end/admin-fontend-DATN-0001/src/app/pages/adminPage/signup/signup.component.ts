import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import {accountServiceService} from '../adminEntityService/adminService/account-service.service';
import {Register} from '../adminEntityService/adminEntity/LoginDTO/register.dto';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  email: string;
  password: string;
  retypePassword: string;
  fullname: string;
  active: boolean;
  createdDate: Date;


  constructor(private router: Router, private userService: accountServiceService) {
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.active = true;
    this.createdDate = new Date();

  }

  showRePassword = false;
  showPassword = false;

  toggleShowRePassword() {
    this.showRePassword = !this.showRePassword;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (this.registerForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    if (this.password !== this.retypePassword) {
      alert("Mật khẩu không khớp");
      return;
    }


    const Register: Register = {
      fullname: this.fullname,
      email: this.email,
      password: this.password,
      retype_password: this.retypePassword,
      active: this.active,
      createdDate: this.createdDate,
      role_id: 1
    };

    this.userService.register(Register).subscribe({
      next: (response: any) => {
        alert("Thành công: " + response);
      },
      complete: () => {
      },
      error: (error: any) => {
        alert("Đăng ký thất bại: " + error);
      }
    });
  }


}
