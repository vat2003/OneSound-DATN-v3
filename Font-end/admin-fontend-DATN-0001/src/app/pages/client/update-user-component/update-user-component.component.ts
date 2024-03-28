import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {login} from '../../adminPage/adminEntityService/adminEntity/DTO/login';
import {Register} from '../../adminPage/adminEntityService/adminEntity/DTO/Register';
import {RegisterDto} from '../../adminPage/adminEntityService/adminEntity/DTO/registerDto';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {TokenService} from '../../adminPage/adminEntityService/adminService/token.service';
import {LoginResponse} from '../../adminPage/adminEntityService/adminEntity/utils/login.response';
import {CommonModule} from '@angular/common';

import {NgToastModule, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-update-user-component',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, NgToastModule],
  templateUrl: './update-user-component.component.html',
  styleUrl: './update-user-component.component.scss'
})
export class UpdateUserComponentComponent implements OnInit {

  @ViewChild('updatedForm') updatedForm !: NgForm;
  userProfileForm: FormGroup;
  typeRequest: string = '';
  buttonHit: boolean = false;
  idEmail: number = 0;
  avatar: string = '';
  loginDto: login = {
    email: '',
    password: '',

  }
  checkExistPhoneNumber: boolean = false;
  RegisterDto: RegisterDto = {
    fullname: '',
    address: '',
    email: '',
    password: '',
    retype_password: '',
    createdDate: new Date(),
    role_id: 1,
    google_account_id: 0,
    facebook_account_id: 0,
    github_account_id: 0,
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
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      email: ['', [Validators.email]],
      phone_number: ['', Validators.minLength(6)],
      password: ['', Validators.minLength(3)],
      retype_password: ['', Validators.minLength(3)],
      address: ['', [Validators.required, Validators.minLength(5)]],
      date_of_birth: [''],
    }, {});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idEmail = params['id'];
      this.typeRequest = params['type'];
    });
    this.save();
  }


  save() {
    debugger
    if (this.typeRequest == "github") {
      debugger
      this.RegisterDto.github_account_id = 1;
      this.userService.getGithubUserInfo(this.idEmail).subscribe({
        next: (response: any) =>{
          debugger
          console.log(response);

          this.avatar = response.picture;
          this.RegisterDto.email = response.email;
          this.RegisterDto.fullname = response.name;
          this.RegisterDto.createdDate = this.userProfileForm.get('date_of_birth')?.value;
          this.RegisterDto.password = this.userProfileForm.get('password')?.value;
          this.RegisterDto.address = this.userProfileForm.get('address')?.value;
          this.RegisterDto.avatar = this.avatar;

          const registerData: Register = {
            fullname: this.RegisterDto.fullname,
            email: this.RegisterDto.email,
            password: "",
            retype_password: this.RegisterDto.retype_password,
            gender: true,
            active: true,
            createdDate: this.RegisterDto.createdDate,
            birthday: this.RegisterDto.createdDate,
            role_id: 1,
          };

          if (this.RegisterDto.email.length >= 6) {
            this.userService.checkEmailExists(this.RegisterDto.email).subscribe({
              next: (exists: boolean) => {
                if (exists) {
                  this.toast.success({
                    detail: 'Welcome Message',
                    summary: "Welcome to OneSound. " + this.RegisterDto.fullname,
                    duration: 5000
                  });
                  this.userService.getemailuser(this.RegisterDto.email).subscribe({
                    next: (response: any) => {
                      debugger
                      this.loginDto.password = "";
                      this.loginDto.email = response.email;
                      // this.loginDto.email = response.email;
                      this.userService.login(this.loginDto).subscribe({
                        next: (response: LoginResponse) => {
                          debugger
                          const {token} = response;
                          this.tokenService.setToken(token);

                          this.userService.getUserDetail(token).subscribe({
                            next: (response: any) => {
                              this.account = {...response};
                              this.userService.saveUserResponseToLocalStorage(response);
                              if (this.account && this.account.accountRole) {
                                if (this.account.accountRole.name === 'admin') {
                                  this.router.navigate(['/onesound/admin']);
                                } else if (this.account.accountRole.name === 'user') {
                                  this.router.navigate(['/onesound/home/explore']);
                                }
                              } else {
                                this.toast.warning({
                                  detail: 'Warning Message',
                                  summary: 'ROLE ERROR',
                                  duration: 5000
                                });

                              }
                            },
                            error: (error: any) => {
                              console.log(error);
                            },
                          });
                        },
                        error: (error: any) => {
                          console.log(error);
                        }
                      });
                    },
                    error: (error: any) => {
                      this.toast.warning({detail: 'Warning Message', summary: 'LOGIN ERROR', duration: 10000});
                    }
                  });
                } else {
                  this.userService.register(registerData).subscribe({
                    next: (response: any) => {
                      this.toast.success({
                        detail: 'Welcome Message',
                        summary: "Welcome to OneSound. " + this.RegisterDto.fullname,
                        duration: 5000
                      });

                      this.loginDto.password = "";
                      this.loginDto.email = this.RegisterDto.email;
                      this.userService.login(this.loginDto).subscribe({
                        next: (response: LoginResponse) => {
                          const {token} = response;
                          this.tokenService.setToken(token);

                          this.userService.getUserDetail(token).subscribe({
                            next: (response: any) => {
                              this.account = {...response};
                              this.userService.saveUserResponseToLocalStorage(response);
                              if (this.account && this.account.accountRole) {
                                if (this.account.accountRole.name === 'admin') {
                                  this.router.navigate(['/onesound/admin']);
                                } else if (this.account.accountRole.name === 'user') {
                                  this.router.navigate(['/onesound/home/explore']);
                                }
                              } else {
                                alert('Lỗi: Không tìm thấy thông tin vai trò người dùng.');
                              }
                            },
                            error: (error: any) => {
                              console.log(error);
                            },
                          });
                        },
                        error: (error: any) => {
                          console.log(error);
                        }
                      });
                    },
                    error: (error: any) => {
                      console.log("Lỗi khi đăng ký: " + error.error.message);
                    }
                  });
                }
              },
              error: (error: any) => {
                console.log("Lỗi khi kiểm tra email: " + error.error.message);
              }
            });
          }
          
        },
        complete: () =>{
          debugger;
        },
        error: (error: any) => {
          debugger
          console.log("Error fetching data error: "+error);
        }
      })

    } else {
      debugger
      if (this.typeRequest == "email") {
        this.RegisterDto.google_account_id = 1;
        this.userService.getGoogleUserInfo(this.idEmail).subscribe({
          next: (response: any) => {
            this.avatar = response.picture;
            this.RegisterDto.email = response.email;
            this.RegisterDto.fullname = response.name;
            this.RegisterDto.createdDate = this.userProfileForm.get('date_of_birth')?.value;
            this.RegisterDto.password = this.userProfileForm.get('password')?.value;
            this.RegisterDto.address = this.userProfileForm.get('address')?.value;
            this.RegisterDto.avatar = this.avatar;

            const registerData: Register = {
              fullname: this.RegisterDto.fullname,
              email: this.RegisterDto.email,
              password: "",
              retype_password: this.RegisterDto.retype_password,
              gender: true,
              active: true,
              createdDate: this.RegisterDto.createdDate,
              birthday: this.RegisterDto.createdDate,
              role_id: 1,
            };

            if (this.RegisterDto.email.length >= 6) {
              this.userService.checkEmailExists(this.RegisterDto.email).subscribe({
                next: (exists: boolean) => {
                  if (exists) {
                    this.toast.success({
                      detail: 'Welcome Message',
                      summary: "Welcome to OneSound. " + this.RegisterDto.fullname,
                      duration: 5000
                    });
                    this.userService.getemailuser(this.RegisterDto.email).subscribe({
                      next: (response: any) => {
                        debugger
                        this.loginDto.password = "";
                        this.loginDto.email = response.email;
                        // this.loginDto.email = response.email;
                        this.userService.login(this.loginDto).subscribe({
                          next: (response: LoginResponse) => {
                            debugger
                            const {token} = response;
                            this.tokenService.setToken(token);

                            this.userService.getUserDetail(token).subscribe({
                              next: (response: any) => {
                                this.account = {...response};
                                this.userService.saveUserResponseToLocalStorage(response);
                                if (this.account && this.account.accountRole) {
                                  if (this.account.accountRole.name === 'admin') {
                                    this.router.navigate(['/onesound/admin']);
                                  } else if (this.account.accountRole.name === 'user') {
                                    this.router.navigate(['/onesound/home/explore']);
                                  }
                                } else {
                                  this.toast.warning({
                                    detail: 'Warning Message',
                                    summary: 'ROLE ERROR',
                                    duration: 5000
                                  });

                                }
                              },
                              error: (error: any) => {
                                console.log(error);
                              },
                            });
                          },
                          error: (error: any) => {
                            console.log(error);
                          }
                        });
                      },
                      error: (error: any) => {
                        this.toast.warning({detail: 'Warning Message', summary: 'LOGIN ERROR', duration: 10000});
                      }
                    });
                  } else {
                    this.userService.register(registerData).subscribe({
                      next: (response: any) => {
                        this.toast.success({
                          detail: 'Welcome Message',
                          summary: "Welcome to OneSound. " + this.RegisterDto.fullname,
                          duration: 5000
                        });

                        this.loginDto.password = "";
                        this.loginDto.email = this.RegisterDto.email;
                        this.userService.login(this.loginDto).subscribe({
                          next: (response: LoginResponse) => {
                            const {token} = response;
                            this.tokenService.setToken(token);

                            this.userService.getUserDetail(token).subscribe({
                              next: (response: any) => {
                                this.account = {...response};
                                this.userService.saveUserResponseToLocalStorage(response);
                                if (this.account && this.account.accountRole) {
                                  if (this.account.accountRole.name === 'admin') {
                                    this.router.navigate(['/onesound/admin']);
                                  } else if (this.account.accountRole.name === 'user') {
                                    this.router.navigate(['/onesound/home/explore']);
                                  }
                                } else {
                                  alert('Lỗi: Không tìm thấy thông tin vai trò người dùng.');
                                }
                              },
                              error: (error: any) => {
                                console.log(error);
                              },
                            });
                          },
                          error: (error: any) => {
                            console.log(error);
                          }
                        });
                      },
                      error: (error: any) => {
                        console.log("Lỗi khi đăng ký: " + error.error.message);
                      }
                    });
                  }
                },
                error: (error: any) => {
                  console.log("Lỗi khi kiểm tra email: " + error.error.message);
                }
              });
            }
          },
          error: (error: any) => {
            console.log("Lỗi khi lấy thông tin từ Google: " + error.error.message);
          }
        });
      }
    }
  }


  checkEmailExists() {
    this.checkExistPhoneNumber = false;
    this.buttonHit = true;
    this.userService.checkEmailExists(this.userProfileForm.get('phone_number')?.value).subscribe({
      next: (response: any) => {
        ;
        if (response.id >= 1) {
          this.checkExistPhoneNumber = true;
        } else {
          this.checkExistPhoneNumber = false;
        }
        console.log(this.checkExistPhoneNumber);
      },
      complete: () => {
        ;
      },
      error: (error: any) => {
        ;
        console.log("Error fetching data: error " + error);
      }
    })
  }

  protected readonly confirm = confirm;
}
