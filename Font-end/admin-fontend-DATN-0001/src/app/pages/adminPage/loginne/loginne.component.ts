import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { account } from '../adminEntityService/adminEntity/account/account';
import { login } from '../adminEntityService/adminEntity/DTO/login';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { TokenService } from '../adminEntityService/adminService/token.service';
import { LoginResponse } from '../adminEntityService/adminEntity/utils/login.response';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialUser } from 'angularx-social-login';
import { Register } from '../adminEntityService/adminEntity/DTO/Register';


@Component({
  selector: 'app-loginne',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  providers: [
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('423644450056-m6dpvi9ilk7hp8vbiul7egjr1dte9j8o.apps.googleusercontent.com'),
            scope: 'email,public_profile'
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('881207913434756')
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],

  templateUrl: './loginne.component.html',
  styleUrl: './loginne.component.scss'

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


  constructor(private router: Router,
    private userService: accountServiceService,
    private tokenService: TokenService,
    // private authService: SocialAuthService,
  ) {
  }

  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    // });
  }


  // loginWithFacebook(): void {
  //   debugger
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);


  //   // Subscribe to authState observable
  //   this.authService.authState.subscribe((user) => {
  //     debugger
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
  //   debugger
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }


  dangky() {
    this.router.navigate(['onesound/signup']);

  }

  login() {
    this.userService.checkEmailExists(this.email).subscribe({
      next: (emailExists: boolean) => {
        if (emailExists) {
          var login: login = {
            email: this.email,
            password: this.password,
          };
          debugger
          this.userService.login(login).subscribe({
            
            next: (response: LoginResponse) => {
              
              alert("Login successful!");
             
              const { token } = response;
              console.log(token);
              this.tokenService.setToken(token);
              this.incorrectLoginAttempts = 0;

              this.userService.getUserDetail(token).subscribe({
                
                next: (response: any) => {
                  debugger
                  this.account = {
                    ...response
                  };
                  console.log(response);
                  this.userService.saveUserResponseToLocalStorage(response);
                  if (this.account && this.account.accountRole) {
                    debugger
                    alert(this.account.accountRole.name); 
            
                    if (this.account.accountRole.name === 'admin') {
                      debugger
                      this.router.navigate(['/onesound/admin']);
                    } else if (this.account.accountRole.name === 'user') {
                      debugger
                      this.router.navigate(['/onesound/home/explore']);
    
                    }
                  } else {
                    debugger
                    alert("Error: User role information not found.");
                  }
                },
                complete: () => {
                },
                error: (error: any) => {
                  console.log(error);
                }
              });
           
            },
            error: (error) => {
              console.error(error);
              alert("Wrong password, please check again");
              this.incorrectLoginAttempts++;

              if (this.incorrectLoginAttempts >= this.maxIncorrectLoginAttempts) {
                alert("Too many incorrect login attempts. Please try again later.");
                this.router.navigate(['/onesound/dangky']);
              }
            },
            complete: () => {
            }
          });
        } else {
          alert("Email does not exist. Please check or register.");
        }
      },
      error: (error) => {
        console.error(error);
        alert("Please do not leave blank");
      }
    });
  }


}
