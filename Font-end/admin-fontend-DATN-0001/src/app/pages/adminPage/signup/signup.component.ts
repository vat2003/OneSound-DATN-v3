import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import {accountServiceService} from '../adminEntityService/adminService/account-service.service';
import {Register} from '../adminEntityService/adminEntity/LoginDTO/register.dto';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass,
    NgIf
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
      alert("PLEASE FILL UP THE FORM!");
      return;
    }

    if (this.password !== this.retypePassword) {
      alert("The password does not match");
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
        debugger;
        alert("Sign up successfully");
        console.log(response);
        this.router.navigate(['onesound/signin']);
        return;
      },
      complete: () => {
      },
      error: (error: any) => {
        debugger
        alert("Sign up failed: " + error);
      }
    });
  }


}
