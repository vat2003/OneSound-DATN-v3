import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { account } from '../adminEntityService/adminEntity/account/account';
import { login } from '../adminEntityService/adminEntity/DTO/login';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { TokenService } from '../adminEntityService/adminService/token.service';
import { LoginResponse } from '../adminEntityService/adminEntity/utils/login.response';


@Component({
  selector: 'app-loginne',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  

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
    private tokenService: TokenService,

    
  ) 
  {}

  ngOnInit(): void {
  
  }







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
     
        alert("Your account has been locked x2" )
        console.log(error);
        
      },
      complete: () => {
        console.log('Yêu cầu hoàn thành');
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
