import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {LoginResponse} from "../adminEntityService/adminEntity/utils/login.response";
import {Observable} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
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
    NgClass,
    NgToastModule
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



  constructor(private toast: NgToastService,private route: ActivatedRoute, private userService: accountServiceService) {
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

  validation() {
    if (this.registerForm.invalid) {
      console.log("Form is invalid");
      this.toast.warning({detail: 'Warning Message', summary: 'PLEASE FILL UP THE FORM', duration: 5000});
      // alert("PLEASE FILL UP THE FORM!");
      return;
    }
    if (this.password !== this.retypePassword) {
      // alert("The password does not match");
      this.toast.warning({detail: 'Warning Message', summary: 'THE PASSWORD DOES NOT MATCH', duration: 5000});
      return;
    }
  }

  changePass() {
    // this.validation();
    const mail = 'anhtaivo@gmail.com';
    this.updatePassAccount(mail);
  }

  private updatePassAccount(email: any) {
    this.userService.checkEmailExists(email).subscribe({
      next: (emailExists: boolean) => {
        if (emailExists) {
          alert('ok');
        } else {
          alert("Email does not exist. Please check or register.");
        }
      },
      error: (error) => {
        console.error(error);
        alert("Error checking email: " + error.message);
      }
    });
  }



  private extractEmailFromToken(token: string): string {
    const emailStartIndex = token.indexOf('=') + 1;
    return token.substring(emailStartIndex);
  }

  register() {

    const url = window.location.href;
    const startIndex = url.indexOf('/changepassword/') + '/changepassword/'.length;
    const endIndex = url.indexOf('?a=');

    if (startIndex !== -1 && endIndex !== -1) {
      const test = url.substring(startIndex, endIndex);
      this.tokenn = this.extractEmailFromToken(test);

      this.userService.getchecktokem(this.tokenn).subscribe({
        next: (response: any) => {
          debugger
          alert("tokenn  successfully" + this.tokenn);
          console.log(response);

          const login: login = {
            email: this.userEmail,
            password: this.password

          };
          debugger
          this.userService.HamDoiMatKhauCuaQuenMatKhau(this.userEmail,login).subscribe({
            next: (response: any) => {
              debugger
              alert("đổi thành công" + response);
              console.log(response);
            },
            complete: () => {
              debugger
            },
            error: (error: any) => {
              debugger
              alert("Thất bại" + error);
            }
          });

        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          alert("Thất bại" + error);
        }
      });


    } else {
      // Xử lý trường hợp không tìm thấy đoạn token trong URL
      console.error('Token not found in the URL.');
    }


    // if (this.registerForm.invalid) {
    //   console.log("Form is invalid");
    //   alert("PLEASE FILL UP THE FORM!");
    //   return;
    // }

    // if (this.password !== this.retypePassword) {
    //   alert("The password does not match");
    //   return;
    // }



  }

}
