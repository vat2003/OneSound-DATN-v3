import { NgClass, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { Register } from '../adminEntityService/adminEntity/DTO/Register';

@Component({
  selector: 'app-dangky',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './dangky.component.html',
  styleUrl: './dangky.component.scss'
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

  
  constructor(private router: Router, private userService: accountServiceService) {
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';   
    this.gender = true;   
    this.active = true;
    this.createdDate = new Date();

  }

  register() {
 
  
    // if (this.registerForm.invalid) {
    //   console.log("Form is invalid");
    //   alert("PLEASE FILL UP THE FORM!");
    //   return;
    // }

    // if (this.password !== this.retypePassword) {
    //   alert("The password does not match");
    //   return;
    // }
  
    const Register: Register = {
      fullname: this.fullname,
      email: this.email,
      password: this.password,
      retype_password: this.retypePassword,
      gender: this.gender, 
      active: this.active,
      createdDate: this.createdDate,
      role_id: 1
    };

    console.log(Register);
    
    this.userService.register(Register).subscribe({
      next: (response: any) => {        
        alert("Sign up successfully");
        console.log(response);
        this.router.navigate(['onesound/signin']);
        return;
      },
      complete: () => {
      },
      error: (error: any) => {
        alert("Thất bại");
      }
    });

  }
}
