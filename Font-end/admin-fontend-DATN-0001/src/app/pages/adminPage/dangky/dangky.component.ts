import {NgClass, NgIf} from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {accountServiceService} from '../adminEntityService/adminService/account-service.service';
import {Register} from '../adminEntityService/adminEntity/DTO/Register';

@Component({
  selector: 'app-dangky',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './dangky.component.html',

  styleUrl: './dangky.component.scss'
})
export class DangkyComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  email: string;
  password: string;
  retypePassword: string;
  gender: boolean;
  fullname: string;
  active: boolean;
  createdDate: Date;
  birthday: Date;

  isEmailValid: boolean = true;


  constructor(private router: Router, private userService: accountServiceService) {
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.gender = true;
    this.active = true;
    this.createdDate = new Date();
    this.birthday = new Date();
    this.birthday.setFullYear(this.createdDate.getFullYear() - 18);

  }

  dangnhap() {
    this.router.navigate(['onesound/signin']);
  }


  // register() {
  //   debugger
  //   // Kiểm tra tính hợp lệ của các trường
  //   if (this.registerForm.valid) {
  //     // Nếu tất cả các trường hợp lệ, tiến hành đăng ký
  //     const registerData: Register = {

  //       fullname: this.fullname,
  //       email: this.email,
  //       password: this.password,
  //       retype_password: this.retypePassword,
  //       gender: this.gender,
  //       active: this.active,
  //       createdDate: this.createdDate,
  //       role_id: 1
  //     };

  //     // Gửi yêu cầu kiểm tra email tồn tại trước khi đăng ký
  //     this.userService.checkEmailExists(this.email).subscribe({
  //       next: (emailExists: boolean) => {
  //         debugger
  //         if (emailExists) {
  //           alert("Email already exists. Please use a different email.");
  //         } else {
  //           this.userService.register(registerData).subscribe({
  //             next: (response: any) => {
  //               debugger
  //               alert("Sign up successfully");
  //               console.log(response);
  //               this.router.navigate(['onesound/dangnhap']);
  //               return;
  //             },
  //             complete: () => {
  //               debugger
  //             },
  //             error: (error: any) => {
  //               debugger
  //               alert("Thất bại");
  //             }
  //           });
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error("Error checking email existence", error);
  //       }
  //     });

  //   } else {
  //     alert("vui lòng không để trống các thông tin người dùng");
  //   }
  // }

  register() {
    debugger
    // Kiểm tra tính hợp lệ của các trường
    if (this.registerForm.valid) {
      debugger
      // Kiểm tra xem các trường thông tin có rỗng không
      if (
        !this.email ||
        !this.password ||
        !this.retypePassword ||
        !this.fullname ||
        !this.birthday
      ) {
        debugger
        alert("Vui lòng điền đầy đủ thông tin người dùng.");
        return;
      }
      debugger
      // Kiểm tra xem mật khẩu có trùng khớp không
      if (this.password !== this.retypePassword) {
        alert("Mật khẩu không trùng khớp");
        return;
      }

      // Tạo đối tượng dữ liệu đăng ký
      debugger
      const registerData: Register = {
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        retype_password: this.retypePassword,
        gender: this.gender,
        active: this.active,
        createdDate: this.createdDate,
        birthday: this.birthday,
        role_id: 1
      };
      debugger
      // Gửi yêu cầu kiểm tra email tồn tại trước khi đăng ký
      this.userService.checkEmailExists(this.email).subscribe({
        next: (emailExists: boolean) => {
          if (emailExists) {
            alert("Email đã tồn tại. Vui lòng sử dụng email khác.");
          } else {
            // Nếu không có vấn đề gì, tiến hành đăng ký
            this.userService.register(registerData).subscribe({
              next: (response: any) => {
                alert("Đăng ký thành công");
                console.log(response);
                this.router.navigate(['onesound/dangnhap']);
              },
              complete: () => {
              },
              error: (error: any) => {
                alert("Thất bại");
                console.error(error);
              }
            });
          }
        },
        error: (error: any) => {
          console.error("Lỗi kiểm tra sự tồn tại của email", error);
        }
      });

    } else {
      alert("Vui lòng không để trống các thông tin người dùng");
    }
  }


  checkAge() {
    if (this.createdDate) {
      const today = new Date();
      const birthDate = new Date(this.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invalidAge': true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
