import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  password: string;
  retypePassword: string;


  constructor() {
    this.password = '';
    this.retypePassword = '';

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

  }


}
