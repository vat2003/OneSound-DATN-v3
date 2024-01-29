import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { Register } from '../adminEntityService/adminEntity/LoginDTO/register.dto';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  email: string;
  password: string;
  retypePassword: string;
  gender: boolean; 

  fullname: string;
  active: boolean;
  createdDate: Date;


  constructor(private router: Router, private userService: accountServiceService){
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';   
    this.gender = true;   
    this.active = true;
    this.createdDate = new Date();

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
      gender: this.gender, 
      active: this.active,
      createdDate: this.createdDate,
      role_id: 1
    };
  
    this.userService.register(Register).subscribe({
      next: (response: any) => {
        alert("Thành công");
      },
      complete: () => {
      },
      error: (error: any) => {
        alert("Thất bại");
      }
    });
  }
  
  
  


}
