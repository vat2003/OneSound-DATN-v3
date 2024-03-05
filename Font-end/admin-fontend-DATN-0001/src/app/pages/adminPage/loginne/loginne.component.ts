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
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
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

  constructor(private router: Router,
    private userService: accountServiceService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
  }

  dangky() {
    this.router.navigate(['onesound/signup']);

  }

  login() {
    debugger
    this.userService.checkEmailExists(this.email).subscribe({
      next: (emailExists: boolean) => {
        debugger
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
                      window.onload;
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
