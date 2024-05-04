import {NgClass, NgIf} from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {accountServiceService} from '../adminEntityService/adminService/account-service.service';
import {Register} from '../adminEntityService/adminEntity/DTO/Register';

@Component({
  selector: 'app-dangky',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass, NgIf],
  templateUrl: './dangky.component.html',

  styleUrl: './dangky.component.scss',
})
export class DangkyComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  email: string;
  password: string;
  retypePassword: string;
  gender: boolean;
  fullname: string;
  active: boolean;
  createdDate: Date;
  birthday: Date;

  isEmailValid: boolean = true;

  constructor(
    private router: Router,
    private userService: accountServiceService
  ) {
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.gender = true;
    this.active = true;
    this.createdDate = new Date();
    this.birthday = new Date();
    this.birthday.setFullYear(this.createdDate.getFullYear() - 18);
  }

  dangnhap() {
    this.router.navigate(['onesound/signin']);
  }

  register() {

    if (this.registerForm.valid) {
      if (
        !this.email ||
        !this.password ||
        !this.retypePassword ||
        !this.fullname ||
        !this.birthday
      ) {
        alert('Please fill in all user information.');
        return;
      }

      if (this.password !== this.retypePassword) {
        alert('The password does not match');
        return;
      }

      const registerData: Register = {
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        retype_password: this.retypePassword,
        gender: this.gender,
        active: this.active,
        createdDate: this.createdDate,
        birthday: this.birthday,
        role_id: 1,
      };

      this.userService.hot("create", registerData.email).subscribe(
        async (data) => {

          console.log(data);
          return;
        },
        (error) => {

          console.log(error);
          return;
        }
      );

      this.userService.checkEmailExists(this.email).subscribe({
        next: (emailExists: boolean) => {

          if (emailExists) {

            alert('Email already exists. Please use another email.');
          } else {

            this.userService.register(registerData).subscribe({
              next: (response: any) => {
                debugger
                alert('Registration successful');
                console.log(response);
                this.router.navigate(['onesound/dangnhap']);
              },
              complete: () => {
              },
              error: (error: any) => {
                alert('Failed');
                console.error(error);
              },
            });
          }
        },
        error: (error: any) => {

          console.error('Error checking email existence', error);
        },
      });
    } else {

      alert('Please do not leave user information blank');
    }
  }

  checkAge() {
    if (this.createdDate) {
      const today = new Date();
      const birthDate = new Date(this.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['birthday'].setErrors({
          invalidAge: true,
        });
      } else if (age > 80) {
        this.registerForm.form.controls['birthday'].setErrors({
          invalidAge: true,
          tooOld: true,
        });
      } else {
        this.registerForm.form.controls['birthday'].setErrors(null);
      }
    }
  }
}
