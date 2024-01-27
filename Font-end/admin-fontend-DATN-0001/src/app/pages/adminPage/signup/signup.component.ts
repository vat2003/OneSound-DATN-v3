import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { RegisterDTO } from '../adminEntityService/adminEntity/LoginDTO/register.dto';

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
  fullname: string;
  active: boolean;
  createdDate: Date;


  constructor(private router: Router, private userService: accountServiceService){
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';   
    this.active = true;
    this.createdDate = new Date();

  }
  register() {
    if (this.registerForm.invalid) {
      console.log("Form is invalid");
      return;
    }
  

    const message = `phone: ${this.email}`+
      `password: ${this.password}`+
      `retypePassword: ${this.retypePassword}`+
      `fullName: ${this.fullname}`+
      `date: ${this.createdDate}`+
      `isAccepted: ${this.active}`;
    console.log(message);
    alert(message);
  
    const registerDTO: RegisterDTO = {
      fullname: this.fullname,
      email: this.email,
      password: this.password,
      retype_password: this.retypePassword,
      active: this.active,
      createdDate: this.createdDate,  
      role_id: 1
    };
  
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        alert("thành công")
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        alert("thất bại" + error)

      }
    });
  }
  



}
