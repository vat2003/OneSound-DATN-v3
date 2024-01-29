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
import { LoginResponse } from '../adminEntityService/adminEntity/utils/login.response';
import * as jwt_decode from "jsonwebtoken";

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

  email: string = '';
  password: string = '';
  account1?: account;
  account?: account | null;
  showPassword: boolean = false;


  constructor(
    private router: Router,
    private userService: accountServiceService,
    private tokenService: TokenService,


  ) { }

  ngOnInit(): void {
    alert(this.account)
    console.log(this.account);
    
    this.account = this.userService.getUserResponseFromLocalStorage();    
  }



  login() {
    var login: login = {
      email: this.email,
      password: this.password,
    };
      
  
    this.userService.login(login).subscribe({
      next: (response: LoginResponse) => {
        alert("Đăng nhập thành công! Response: " + response);
        const { token } = response;
        console.log(token);
  
        this.tokenService.setToken(token);
        this.userService.getUserDetail(token).subscribe({
                    
          next: (response: any) => {  
                      
            this.account = {
              ...response
            };   
            alert("profile thành công " + response.fullname
            );
            console.log(response);
            this.userService.saveUserResponseToLocalStorage(response); 
           
            this.router.navigate(['/onesound/admin']);                      

          },
          complete: () => {
          },
          error: (error: any) => {
            alert("profile thất bại" + error);
            console.log(error);
          }
        });
      },
      error: (error) => {
        debugger
        console.error(error);
        alert("Đăng nhập thất bại");
      },
      complete: () => {}
    });
  }

 
  
  
  
}
