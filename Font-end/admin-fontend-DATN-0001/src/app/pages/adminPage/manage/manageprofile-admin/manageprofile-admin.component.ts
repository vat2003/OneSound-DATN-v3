import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class ManageprofileAdminComponent implements OnInit{
  userResponse?: account;
  userProfileForm: FormGroup;
  token:string = '';
  account?:account | null;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: accountServiceService,
    private router: Router,
    private tokenService: TokenService,
  ){        
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],     
      address: ['', [Validators.minLength(3)]],       
      password: ['', [Validators.minLength(3)]], 
      createdDate: [Date.now()],      
    }, {
    });
  }
  ngOnInit(): void {  
    
    this.account = this.userService.getUserResponseFromLocalStorage();
   
  }

  // save(): void {
    
  //     const account: account = {
  //       fullname: this.userProfileForm.get('fullname')?.value,
  //       email: this.userProfileForm.get('email')?.value,
  //       address: this.userProfileForm.get('address')?.value,
  //       password: this.userProfileForm.get('password')?.value,
  //       createdDate: this.userProfileForm.get('createdDate')?.value,
  //       active: this.userProfileForm.get('active')?.value,
  //       avatar_url: this.userProfileForm.get('avatar_url')?.value,
  //       gender: this.userProfileForm.get('gender')?.value,
  //       accountRole: this.userProfileForm.get('accountRole')?.value,    
  //     }
  //     console.log(account);

  // }  


}
