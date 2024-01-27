import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { account } from '../adminEntityService/adminEntity/account/account';
import { login } from '../adminEntityService/adminEntity/LoginDTO/login';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { TokenService } from '../adminEntityService/adminService/token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../adminEntityService/adminService/token.interceptor';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],

  templateUrl: './signin.component.html',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  phoneNumber: string = '';
  password: string = '';
  account?: account;
  showPassword: boolean = false;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: accountServiceService,
    private tokenService: TokenService,

  ) { }

  ngOnInit(): void {
  }

  login() {
    var login: login = {
      email: this.phoneNumber,
      password: this.password,
    };
    this.userService.login(login).subscribe({
      next: (response) => {
        alert("thành công");  
      },
      error: (error) => {
       
        console.error(error);
        alert("thất bại");
      },
      complete: () => {
      }
    });
    
  }
}
