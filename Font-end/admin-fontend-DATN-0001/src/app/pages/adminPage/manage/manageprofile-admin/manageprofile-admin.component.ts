import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { accountServiceService } from '../../adminEntityService/adminService/account-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { account } from '../../adminEntityService/adminEntity/account/account';
import { TokenService } from '../../adminEntityService/adminService/token.service';
import { UpdateUserDTO } from '../../adminEntityService/adminEntity/DTO/update.user.dto';

@Component({
  selector: 'app-manageprofile-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manageprofile-admin.component.html',
  styleUrl: './manageprofile-admin.component.scss'
})
export class ManageprofileAdminComponent implements OnInit {
  userResponse?: account;
  token: string = '';
  account?: account | null;
  userProfileForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private userService: accountServiceService,
    private router: Router,

  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      id: [''],
      email: [''],
      address: [''],
      createdDate: [''],
      gender: true,
      avatar_url: [''],
      role_id: 1
    }, {
    });
  }
  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(this.account?.createdDate, 'yyyy-MM-dd') ?? '';

    this.userProfileForm.patchValue({
      fullname: this.account?.fullname ?? '',
      id: this.account?.id ?? '',
      email: this.account?.email ?? '',
      address: this.account?.address ?? '',
      avatar_url: this.account?.avatar_url ?? '',
      gender: this.account?.gender ?? true,
      createdDate: formattedDate,
      role_id: 1
    });

  }

  save() {
    debugger
    const updateUserDTO: UpdateUserDTO = {
      id: this.userProfileForm.get('id')?.value,
      email: this.userProfileForm.get('email')?.value,
      fullname: this.userProfileForm.get('fullname')?.value,
      address: this.userProfileForm.get('address')?.value,
      avatar_url: this.userProfileForm.get('avatar_url')?.value,
      gender: this.userProfileForm.get('gender')?.value,
      createdDate: this.userProfileForm.get('createdDate')?.value,
      role_id: 1
    };

    this.userService.UpdateProfile(updateUserDTO)
      .subscribe({

        next: (response: any) => {
          // debugger
          // this.router.navigate(['/onesound/dangnhap']);
          console.log(response);
          alert('update profile successfully');
        },
        error: (error: any) => {
          debugger
          alert(error.error.message);
        }
      });
  }
}
