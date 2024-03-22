import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { login } from '../../adminPage/adminEntityService/adminEntity/DTO/login';
import { Register } from '../../adminPage/adminEntityService/adminEntity/DTO/Register';
import { RegisterDto } from '../../adminPage/adminEntityService/adminEntity/DTO/registerDto';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { TokenService } from '../../adminPage/adminEntityService/adminService/token.service';
import { LoginResponse } from '../../adminPage/adminEntityService/adminEntity/utils/login.response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-user-component',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule,    ReactiveFormsModule ],
  templateUrl: './update-user-component.component.html',
  styleUrl: './update-user-component.component.scss'
})
export class UpdateUserComponentComponent implements OnInit{

  @ViewChild('updatedForm') updatedForm !: NgForm;
  userProfileForm: FormGroup;
  typeRequest: string ='';
  buttonHit: boolean = false;
  idEmail: number = 0;
  avatar: string = '';  
  loginDto: login = {
    email: '',
    password: '',
 
  }
  checkExistPhoneNumber: boolean = false;
  RegisterDto: RegisterDto = {
    fullname : '',
    address: '',
    email: '',
    password : '',
    retype_password : '',
    createdDate: new Date(),
    role_id: 1,
    google_account_id: 0,
    facebook_account_id: 0,
    avatar: ''
  };
  // userResponse?: UserResponse;
  account?: account | null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: accountServiceService,
    private tokenService: TokenService,
    private route: ActivatedRoute
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      email: ['', [Validators.email]],
      phone_number: ['', Validators.minLength(6)],
      password: ['', Validators.minLength(3)],
      retype_password: ['', Validators.minLength(3)],
      address: ['', [Validators.required, Validators.minLength(5)]],
      date_of_birth: [''],
    }, {
    });
  }
  ngOnInit() {
    debugger;
    this.route.queryParams.subscribe(params => {
      this.idEmail = params['id'];
      this.typeRequest = params['type'];
    });
  }

  save(){
    debugger; 
    if (this.typeRequest=="facebook"){
      
    } else {
      if (this.typeRequest=="email"){
        this.RegisterDto.google_account_id = 1;
        this.userService.getGoogleUserInfo(this.idEmail).subscribe({
          next: (response: any) =>{
            debugger;
            this.avatar = response.picture;
            this.RegisterDto.email = response.email;
            this.RegisterDto.fullname = "";
            this.RegisterDto.createdDate = this.userProfileForm.get('date_of_birth')?.value;
            this.RegisterDto.password = this.userProfileForm.get('password')?.value;
            this.RegisterDto.address = this.userProfileForm.get('address')?.value;
            this.RegisterDto.avatar = this.avatar;
            this.RegisterDto.retype_password = this.RegisterDto.password;
         
            const registerData: Register = {
              fullname: this.RegisterDto.fullname,
              email: this.RegisterDto.email,
              password: this.RegisterDto.password,
              retype_password: this.RegisterDto.retype_password,
              gender: true,
              active: true,
              createdDate: this.RegisterDto.createdDate,
              birthday: this.RegisterDto.createdDate,
              role_id: 1,
            };

            this.userService.register(registerData).subscribe({
              next: (response: any) =>{
                debugger;
                alert("You have been updated successfully! Please login again");
                this.loginDto.password = this.RegisterDto.password;
                this.loginDto.email = this.RegisterDto.email;
                console.log(response);
                
                this.userService.login(this.loginDto)
                  .subscribe({
                      next: (response: LoginResponse) => {
                        debugger
                        const {token} = response
                        this.tokenService.setToken(token);
                        debugger;
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
                      complete: () => {
                        debugger
                      },
                      error: (error : any) => {
                        debugger
                      }
                    }
                  );
              },
              complete: () =>{
                debugger;
              },
              error: (error: any) => {
                debugger
                console.log("Error fetching data error x1: "+error);
              }
            });
          },
          complete: () =>{
            debugger;
          },
          error: (error: any) => {
            console.log("Error fetching data error x2 : "+error);
          }
        })
      }
    }
  }
  checkEmailExists(){
    this.checkExistPhoneNumber=false;
    this.buttonHit = true;
    this.userService.checkEmailExists(this.userProfileForm.get('phone_number')?.value).subscribe({
      next: (response: any) =>{
        debugger;
        if (response.id>=1){
          this.checkExistPhoneNumber = true;
        } else {
          this.checkExistPhoneNumber = false;
        }
        console.log(this.checkExistPhoneNumber);
      },
      complete: () =>{
        debugger;
      },
      error: (error: any) =>{
        debugger;
        console.log("Error fetching data: error "+error);
      }
    })
  }

  protected readonly confirm = confirm;
}
