import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {account} from '../adminEntityService/adminEntity/account/account';
import {login} from '../adminEntityService/adminEntity/DTO/login';
import {accountServiceService} from '../adminEntityService/adminService/account-service.service';
import {TokenService} from '../adminEntityService/adminService/token.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../adminEntityService/adminService/token.interceptor';
import {LoginResponse} from '../adminEntityService/adminEntity/utils/login.response';

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
  account?: account | null;
  showPassword: boolean = false;




  constructor(private router: Router,
              private userService: accountServiceService,
              private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.account);

    this.account = this.userService.getUserResponseFromLocalStorage();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // login() {    
  //   debugger
  //   var login: login = {
      
  //     email: this.email,
  //     password: this.password,
  //   };    
  //   this.userService.login(login).subscribe({    
  //     next: (response: LoginResponse) => {   
  //       debugger     
  //       if (this.account && this.account.accountRole) {
  //         debugger
  //         if (this.account.accountRole.name === 'admin') {
  //           debugger
  //           alert("admin")
  //           this.router.navigate(['/onesound/admin']);
  //         } else if (this.account.accountRole.name === 'user') {
  //           debugger
  //           alert("user")

  //           this.router.navigate(['/']);
  //         }
  //       } else {
  //         alert("Lỗi: Không tìm thấy thông tin vai trò người dùng.");
  //       }

  //       const {token} = response;
  //       console.log(token);

  //       this.tokenService.setToken(token);
  //       this.userService.getUserDetail(token).subscribe({

  //         next: (response: any) => {            
  //           this.account = {              
  //             ...response
  //           };
  //           this.userService.saveUserResponseToLocalStorage(response);
          
  //         },
  //         complete: () => {            
  //         },
  //         error: (error: any) => {            
  //           alert("profile thất bại" + error);
  //           console.log(error);
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error(error);
  //       alert("Đăng nhập thất bại");
  //     },
  //     complete: () => {
  //     }
  //   });
  // }

  login() {
    // const login: login = {
    //   email: this.email,
    //   password: this.password,
    // };
  
    // this.userService.login(login).subscribe({
    //   next: (response: LoginResponse) => {
    //     if (this.account && this.account.accountRole) {
    //       alert(this.account.accountRole.name); // Hiển thị vai trò người dùng
  
    //       if (this.account.accountRole.name === 'admin') {
    //         this.router.navigate(['/onesound/admin']);
    //       } else if (this.account.accountRole.name === 'user') {
    //         this.router.navigate(['/']);
    //       }
    //     } else {
    //       alert("Lỗi: Không tìm thấy thông tin vai trò người dùng.");
    //     }
  
    //     const { token } = response;
    //     console.log(token);
  
    //     this.tokenService.setToken(token);
    //     this.userService.getUserDetail(token).subscribe({
    //       next: (response: any) => {
    //         this.account = {
    //           ...response
    //         };
    //         this.userService.saveUserResponseToLocalStorage(response);
    //       },
    //       error: (error: any) => {
    //         alert("profile thất bại" + error);
    //         console.log(error);
    //       }
    //     });
    //   },
    //   error: (error) => {
    //     console.error(error);
    //     alert("Đăng nhập thất bại");
    //   }
    // });

    alert("ngu")
  }
  


}