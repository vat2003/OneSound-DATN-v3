import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { account } from '../adminEntityService/adminEntity/account/account';
import { login } from '../adminEntityService/adminEntity/DTO/login';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { TokenService } from '../adminEntityService/adminService/token.service';
import { LoginResponse } from '../adminEntityService/adminEntity/utils/login.response';
import { Register } from '../adminEntityService/adminEntity/DTO/Register';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-loginne',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  // providers: [
  //     SocialAuthService,
  //   {
  //     provide: 'SocialAuthServiceConfig',
  //     useValue: {
  //       autoLogin: false,
  //       providers: [
  //         {
  //           id: GoogleLoginProvider.PROVIDER_ID,
  //           provider: new GoogleLoginProvider('423644450056-m6dpvi9ilk7hp8vbiul7egjr1dte9j8o.apps.googleusercontent.com'),
  //           scope: 'email,public_profile'
  //         },
  //         {
  //           id: FacebookLoginProvider.PROVIDER_ID,
  //           provider: new FacebookLoginProvider('881207913434756')
  //         },
  //       ],
  //     } as SocialAuthServiceConfig,
  //   },
  // ],

  templateUrl: './loginne.component.html',
  styleUrl: './loginne.component.scss',
})
export class LoginneComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  email: string = '';
  password: string = '';
  account?: account | null;
  showPassword: boolean = false;
  incorrectLoginAttempts: number = 0;
  maxIncorrectLoginAttempts: number = 5;

  // user: SocialUser | undefined;

  constructor(
    private router: Router,
    private userService: accountServiceService,
    private tokenService: TokenService
  ) // private authService: SocialAuthService,
  {}

  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    // });
  }

  // loginWithFacebook(): void {
  //
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

  //   // Subscribe to authState observable
  //   this.authService.authState.subscribe((user) => {
  //
  //     console.log(user) + "<----------------";
  //     console.log(user) + "<----------------";
  //     console.log(user) + "<----------------";
  //     // const registerData: Register = {
  //     //   fullname: this.user?.firstName,
  //     //   email: this.email,
  //     //   password: this.password,
  //     //   retype_password: this.retypePassword,
  //     //   gender: this.gender,
  //     //   active: this.active,
  //     //   createdDate: this.createdDate,
  //     //   role_id: 1
  //     // };
  //   });

  //   // this.userService.register(registerData).subscribe({
  //   //   next: (response: any) => {
  //   //     alert("Đăng ký thành công");
  //   //     console.log(response);
  //   //     this.router.navigate(['onesound/dangnhap']);
  //   //   },
  //   //   complete: () => {
  //   //   },
  //   //   error: (error: any) => {
  //   //     alert("Thất bại");
  //   //     console.error(error);
  //   //   }
  //   // });
  // }

  // loginWithGoogle(): void {
  //
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  dangky() {
    this.router.navigate(['onesound/signup']);
  }

  login() {
    // this.userService.checkEmailExists(this.email).subscribe({
    //   next: (emailExists: boolean) => {
    // if (emailExists) {
    var login: login = {
      email: this.email,
      password: this.password,
    };
    debugger
    this.userService.checkactive1(login.email).subscribe({

      next: (data) => {
        debugger
        if (data != null) {
          debugger
          console.log(data);
          this.userService.login(login).subscribe({
            next: (response: LoginResponse) => {
              alert('Login successful!');

              const { token } = response;
              console.log(token);
              this.tokenService.setToken(token);
              this.incorrectLoginAttempts = 0;

              this.userService.getUserDetail(token).subscribe({

                next: (response: any) => {

                  this.account = {
                    ...response,
                  };
                  console.log(response);
                  this.userService.saveUserResponseToLocalStorage(response);
                  if (this.account && this.account.accountRole) {

                    alert(this.account.accountRole.name);

                    if (this.account.accountRole.name === 'admin') {

                      this.router.navigate(['/onesound/admin']);
                    } else if (this.account.accountRole.name === 'user') {

                      this.router.navigate(['/onesound/home/explore']);
                    }
                  } else {

                    alert('Error: User role information not found.');
                  }
                },
                complete: () => {},
                error: (error: any) => {
                  console.log(error);
                },
              });
            },
            error: (error) => {
              console.error(error);
              alert('Wrong password, please check again');
              this.incorrectLoginAttempts++;

              if (this.incorrectLoginAttempts >= this.maxIncorrectLoginAttempts) {
                alert('Too many incorrect login attempts. Please try again later.');
                this.router.navigate(['/onesound/dangky']);
              }
            },
            complete: () => {},
          });
        }else{
          alert("Your account has been locked" )

        }

      },
      error: (error) => {
        // Xử lý lỗi khi yêu cầu gặp vấn đề
        alert("Your account has been locked" )
        // Thực hiện các hành động phù hợp với lỗi nhận được
      },
      complete: () => {
        // Xử lý khi yêu cầu hoàn thành (không bắt buộc)
        console.log('Yêu cầu hoàn thành');
        // Thực hiện các hành động phù hợp khi yêu cầu hoàn thành
      }
    });


    // } else {
    //   alert("Email does not exist. Please check or register.");
    // }
    //   },
    //   error: (error) => {
    //     console.error(error);
    //     alert("Please do not leave blank");
    //   }
    // });
  }

  loginByGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
