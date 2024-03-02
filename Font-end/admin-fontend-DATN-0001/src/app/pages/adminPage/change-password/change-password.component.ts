import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { login } from '../adminEntityService/adminEntity/DTO/login';
import { UpdateUserDTO } from '../adminEntityService/adminEntity/DTO/update.user.dto';
import { UpdateUserForAdmin } from '../adminEntityService/adminEntity/DTO/UpdateUserForAdmin';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  password: string;
  retypePassword: string;
  userEmail: string;
  tokenn: string;



  constructor(private route: ActivatedRoute, private userService: accountServiceService,private router: Router) {
    this.password = '';
    this.retypePassword = '';
    this.userEmail = '';
    this.tokenn = '';
  }

  showRePassword = false;
  showPassword = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['a'];
    });
  }

  toggleShowRePassword() {
    this.showRePassword = !this.showRePassword;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  private extractEmailFromToken(token: string): string {
    const emailStartIndex = token.indexOf('=') + 1;
    return token.substring(emailStartIndex);
  }

  // register() {

  //   const url = window.location.href;
  //   const startIndex = url.indexOf('/changepassword/') + '/changepassword/'.length;
  //   const endIndex = url.indexOf('?a=');

  //   if (startIndex !== -1 && endIndex !== -1) {
  //     const test = url.substring(startIndex, endIndex);
  //     this.tokenn = this.extractEmailFromToken(test);

  //     this.userService.getchecktokem(this.tokenn).subscribe({
  //       next: (response: any) => {
  //         debugger
  //         alert("tokenn  successfully" + this.tokenn);
  //         console.log(response);

  //         const login: login = {
  //           email: this.userEmail,
  //           password: this.password

  //         };
  //         debugger
  //         this.userService.HamDoiMatKhauCuaQuenMatKhau(response.message,login).subscribe({
  //           next: (response: any) => {
  //             debugger
  //             alert("đổi thành công" + response);
  //             console.log(response);
  //           },
  //           complete: () => {
  //             debugger
  //           },
  //           error: (error: any) => {
  //             debugger
  //             alert("Thất bại" + error);
  //           }
  //         });

  //       },
  //       complete: () => {
  //         debugger
  //       },
  //       error: (error: any) => {
  //         debugger
  //         alert("Thất bại" + error);
  //       }
  //     });


  //   } else {
  //     console.error('Token not found in the URL.');
  //   }




  // }

  register() {
    if (!this.password || !this.retypePassword) {
      alert("Please enter both password and retype password.");
      return;
    }
    
    if (this.password !== this.retypePassword) {
      alert("Passwords do not match.");
      return;
    }
    
    const url = window.location.href;
    const startIndex = url.indexOf('/changepassword/') + '/changepassword/'.length;
    const endIndex = url.indexOf('?a=');

    if (startIndex !== -1 && endIndex !== -1) {
      const test = url.substring(startIndex, endIndex);
      this.tokenn = this.extractEmailFromToken(test);

      this.userService.getchecktokem(this.tokenn).subscribe({
        next: (response: any) => {
          debugger
          alert("Token successfully");
          console.log(response);
          const login: login = {
            email: this.userEmail,
            password: this.password
          };

          this.userService.HamDoiMatKhauCuaQuenMatKhau(response.message, login).subscribe({
            next: (response: any) => {
              debugger
              alert("Change successful");
              this.router.navigate(['onesound/signin']);

            },
            complete: () => {
              debugger
            },
            error: (error: any) => {
              debugger
              alert("Failed");
            }
          });

        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          alert("Failed");
        }
      });
    } else {
      console.error('Token not found in the URL.');
    }
  }

}
