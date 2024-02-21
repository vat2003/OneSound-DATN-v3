import {Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {LoginResponse} from "../adminEntityService/adminEntity/utils/login.response";
import {accountServiceService} from "../adminEntityService/adminService/account-service.service";
import {Observable} from "rxjs";
import {UpdateUserDTO} from "../adminEntityService/adminEntity/DTO/update.user.dto";

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


  constructor(private toast: NgToastService, private userService: accountServiceService,
  ) {
    this.password = '';
    this.retypePassword = '';

  }

  showRePassword = false;
  showPassword = false;

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

  // update() {
  //   debugger
  //   const updateUserDTO: UpdateUserDTO = {
  //     id: this.userProfileForm.get('id')?.value,
  //     email: this.userProfileForm.get('email')?.value,
  //     fullname: this.userProfileForm.get('fullname')?.value,
  //     address: this.userProfileForm.get('address')?.value,
  //     avatar_url: this.userProfileForm.get('avatar_url')?.value,
  //     gender: this.userProfileForm.get('gender')?.value,
  //     createdDate: this.userProfileForm.get('createdDate')?.value,
  //     role_id: this.userProfileForm.get('role_id')?.value
  //     // role_id: 1
  //   };
  //   // //Trong lúc lưu đối tượng vào Database thì đồng thời Set path và file ảnh lên Firebase
  //   // if (this.imageFile) {
  //   //   await this.firebaseStorage.uploadFile(
  //   //     'adminManageImage/profile/',
  //   //     this.imageFile
  //   //   );
  //   //   updateUserDTO.avatar_url = 'adminManageImage/profile/' + this.imageFile.name;
  //   //   console.log('UPLOAD IMG FILE ==> adminManageImage/profile/' + this.imageFile.name);
  //   this.userService.UpdateProfile(updateUserDTO)
  //     .subscribe({
  //
  //       next: (response: any) => {
  //         //Trong lúc lưu đối tượng vào Database thì đồng thời Set path và file ảnh lên Firebase
  //         // if (this.imageFile) {
  //         //   await this.firebaseStorage.uploadFile(
  //         //     'adminManageImage/profile/',
  //         //     this.imageFile
  //         //   );
  //         // }
  //         // debugger
  //         this.router.navigate(['/onesound/dangnhap']);
  //         console.log(response);
  //         alert('update profile successfully');
  //       },
  //       error: (error: any) => {
  //         debugger
  //         alert(error.error.message);
  //       }
  //     });
  // }


}
