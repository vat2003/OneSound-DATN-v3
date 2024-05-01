import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {account, createAccount} from '../../adminEntityService/adminEntity/account/account';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
import {RoleService} from '../../adminEntityService/adminService/role.service';
import {Role} from '../../adminEntityService/adminEntity/Role/Role';
import {UpdateUserForAdmin} from '../../adminEntityService/adminEntity/DTO/UpdateUserForAdmin';


import {mergeMap, catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject, of} from 'rxjs';
import {NgToastModule, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-manageuser-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage,
    RouterLink, NgToastModule, ReactiveFormsModule],
  templateUrl: './manageuser-admin.component.html',
  styleUrl: './manageuser-admin.component.scss'
})
export class ManageuserAdminComponent implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm;
  id!: number;
  Account: account = createAccount();
  Accounts: account[] = [];
  account?: account | null;
  readOnlyMode: boolean = true;
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;
  showPassword = false;
  showPassword2 = false;
  Roles: Role[] = [];
  Role: Role = new Role();
  selectedRole!: string;
  pages: number[] = [];
  total: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  page: number = 0;
  itempage: number = 1;
  selectedUser: account = createAccount();
  createdDate: Date | undefined;
  birthday: Date;
  searchTerm: string = '';
  titleAlbum: string[] = [];
  activeStatus: boolean = true;
  private searchTerms = new Subject<string>();
  formattedBirthday: string = ''; // Khai báo formattedBirthday và khởi tạo giá trị mặc định
  forceDate: any;

  constructor(
    private accountServiceService: accountServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private RoleService: RoleService,
    private toast: NgToastService
  ) {
    this.createdDate = new Date();
    this.birthday = new Date();
    this.birthday.setFullYear(this.createdDate.getFullYear() - 18);

  }

  toggleMode() {
    this.readOnlyMode = !this.readOnlyMode;
  }


  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    this.getAllUsers(this.page, this.itempage);
  }


  async getAllUsers(page: number, limit: number) {
    this.accountServiceService.getPages(page, limit).subscribe(
      async (data) => {
        console.log(data);
        this.Accounts = data.content;

        for (const Accounts of this.Accounts) {
          if (Accounts.avatar_url == null || Accounts.avatar_url == '') {
            continue;
          }
          Accounts.avatar_url = await this.setImageURLFirebase(Accounts.avatar_url);
        }
        this.total = data.totalPages;
        this.visiblePages = this.PageArray(this.page, this.total);
      }
    );
  }


  PageArray(page: number, total: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(page - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, total);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }


  getAllRole() {

    this.RoleService.getAllRoles().subscribe(
      (data: any) => {

        this.Roles = data;
        console.log('dataa ==== > ' + this.Roles);
      }
    );
    for (const x of this.Roles) {

      console.log(' FOREASCSLC === ' + x.name);
    }

    this.Roles = this.Roles.filter(role => role.name != 'admin');

  }

  Count(role: string) {
    console.log("Đã click nhưng đếu ăn" + Role)
  }

  ngOnInit(): void {

    this.account = this.accountServiceService.getUserResponseFromLocalStorage();

    this.id = this.route.snapshot.params['id'];
    this.getAllUsers(0, 10);
    this.loadUserById();
    this.view(this.id);
    this.getAllRole();
    this.activeStatus = this.registerForm.form.controls['active'].value;

    console.log("===><<<<" + this.account);


  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('passwordField') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';

  }

  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
    const passwordField2 = document.getElementById('passwordField2') as HTMLInputElement;
    passwordField2.type = this.showPassword2 ? 'text' : 'password';

  }

  resetFileInput(): void {
    // Đặt lại giá trị của input file
    const fileInput: any = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 8 * 1024 * 1024; // giối hạn 25 MB
    //Kiểm tra giới hạn kích thước ảnh
    if (selectedFile.size > maxSizeInBytes) {
      alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
      this.resetFileInput();
      return;
    }

    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      this.resetFileInput(); // Hàm này để đặt lại input file sau khi thông báo lỗi
      return;
    }

    //Dọc file ảnh
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const maxW = 800; // chiều rông 800
        const maxH = 800; // chiều cao 800

        let newW = img.width;
        let newH = img.height

        if (img.width > maxW) {
          newW = maxW;
          newH = (img.height * maxW) / img.width;
        }

        if (img.height > maxH) {
          newH = maxH;
          newW = (img.width * maxH) / img.height;
        }

        const canvas = document.createElement('canvas');
        canvas.width = newW;
        canvas.height = newH;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(img, 0, 0, newW, newH);

        const resizedImageData = canvas.toDataURL('image/*')

      }
    }

    const archivoSelectcionado: File = event.target.files[0];
    console.log('FILE OBJECT ==> ', archivoSelectcionado);
    if (archivoSelectcionado) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.fillImage(this.imageUrl);
      };
      //Set path ảnh theo thư mục
      this.setImageUrl = 'adminManageImage/user/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = 'adminManageImage/user/null.jpg';

      this.removeUpload();
    }
  }

  fillImage(url: string): void {
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.image-upload-wrap'),
      'display',
      'none'
    );
    this.renderer.setAttribute(
      this.el.nativeElement.querySelector('.file-upload-image'),
      'src',
      url
    );
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.file-upload-content'),
      'display',
      'block'
    );
    if (url.length == 0) {
      this.removeUpload();
    }
  }

  removeUpload(): void {
    this.imageUrl = '';
    this.setImageUrl = '';

    // this.imageFile = null;
    this.renderer.setProperty(
      this.el.nativeElement.querySelector('.file-upload-input'),
      'value',
      ''
    );
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.file-upload-content'),
      'display',
      'none'
    );
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.image-upload-wrap'),
      'display',
      'block'
    );
  }

  loadUserById() {
    this.accountServiceService.getUserById(this.id).subscribe(
      (data) => {
        this.Account = data;
      },
      (error) => console.log(error)
    );
  }


  onSubmit() {

  }


  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

  async goToUserList() {
    await this.getAllUsers(0, 4);
    await this.router.navigate(['/manage/users']);
  }

  // view(id: number) {
  //   this.accountServiceService.getUserById(id).subscribe(
  //     async (data: account) => {
  //
  //       this.Account = data;
  //       this.setImageUrl = this.Account.avatar_url;
  //       this.imageUrl = this.setImageUrl;
  //       this.formatDate(this.Account.birthday);

  //       this.fillImage(await this.setImageURLFirebase(this.Account.avatar_url));
  //     },
  //     (error: any) => {
  //
  //       console.log(error);
  //     }
  //   );
  // }

  formatDate(birthday: Date | undefined): string {
    if (!birthday) return '';
    // const birthdayMilliseconds = birthday.getTime();
    const birthdayDate = new Date(birthday);
    return birthdayDate.toISOString().split('T')[0];
  }


  view(id: number) {
    this.accountServiceService.getUserById(id).subscribe(
      async (data: account) => {

        this.Account = data;
        this.setImageUrl = this.Account.avatar_url;
        this.imageUrl = this.setImageUrl;
        if (this.Account.birthday) {
          this.forceDate = new DatePipe('en-US').transform(this.Account.birthday, 'yyyy-MM-dd');
          this.Account.birthday = this.forceDate;
          console.log(this.forceDate);
        } else {
          console.log('Birthday is undefined');
        }
        this.fillImage(await this.setImageURLFirebase(this.Account.avatar_url));
      },
      (error: any) => {

        console.log(error);
      }
    );
  }


  // formatDate(date: Date | string | undefined): string {
  //   if (!date) {
  //     return '';
  //   }
  //   const formattedDate = typeof date === 'string' ? date : date.toISOString();
  //   return new DatePipe('en-US').transform(formattedDate, 'yyyy-MM-dd') || '';
  // }


  checkAge() {
    if (this.createdDate) {
      const today = new Date();
      const birthDate = new Date(this.createdDate);
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

  updateUser() {
    if (this.account?.accountRole?.id == 2) {
      if (this.registerForm.valid) {
        if (!this.Account.fullname
        ) {
          alert("Please fill up the form");
          return;
        }
      }


      if (this.Account.id !== undefined) {
        console.log(this.selectedRole);

        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(this.Account?.birthday, 'yyyy-MM-dd') ?? '';

        const UpdateUserForAdmin: UpdateUserForAdmin = {
          fullname: this.Account.fullname,
          email: this.Account.email,
          Phone: this.Account.Phone,
          address: this.Account.address,
          avatar_url: this.Account.avatar_url,
          gender: this.Account.gender,
          password: this.Account.password,
          birthday: this.registerForm.form.controls['birthday'].value,
          active: this.Account.active,
          createdDate: formattedDate,
          accountRole: this.Account.accountRole,
        };
        if (!UpdateUserForAdmin.fullname
        ) {
          this.toast.warning({detail: 'Validate warning', summary: 'Fullname not be null', duration: 5000})
          return;
        }
        if (this.imageFile) {
          UpdateUserForAdmin.avatar_url = this.setImageUrl;
        }

        if (!this.imageFile && !this.setImageUrl) {
          UpdateUserForAdmin.avatar_url = 'adminManageImage/user/null.jpg';
        }


        this.accountServiceService.updateUser(this.Account.id, UpdateUserForAdmin).subscribe(
          async (data) => {


            if (this.imageFile) {
              await this.firebaseStorage.uploadFile(
                'adminManageImage/user/',
                this.imageFile
              );
            }
            this.toast.success({detail: 'Success Message', summary: 'Update successfully', duration: 3000});
            await this.getAllUsers(0, 10);
            this.removeUpload();

            console.log(data);

          },
          (error) => {
            this.toast.error({detail: 'Failed Message', summary: 'Update failed', duration: 3000});
            console.log(error);
            return;
          }
        );
        this.Account = createAccount();

        if (UpdateUserForAdmin.active == false) {

          this.accountServiceService.hot("lock", UpdateUserForAdmin.email).subscribe(
            async (data) => {

              console.log(data);
            },
            (error) => {

              console.log(error);

            }
          );


        } else {


          this.accountServiceService.hot("unlock", UpdateUserForAdmin.email).subscribe(
            async (data) => {

              console.log(data);
              return;
            },
            (error) => {

              console.log(error);
              return;
            }
          );
        }

      } else {
        console.error("ID is undefined");
      }
    } else {
      // alert("nhân viên không có quyền update")
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'Only Administrator can use this Function',
        duration: 3000
      });

    }


  }


  saveUsers() {


    this.Account.avatar_url = this.setImageUrl;
    this.accountServiceService.createAccount(this.Account).subscribe(
      async (data) => {

        this.goToUserList();
        console.log("Update successfully");
        // alert('Update successfully');
        this.toast.success({detail: 'Successfully Message', summary: 'Update Successfully', duration: 3000});
      },
      (error) => {

        console.log("FAILED" + error);
        // alert('Update failed');
        this.toast.error({detail: 'Error Message', summary: 'Update Failed!', duration: 3000});
      }
    );
  }


  getUser(id: number) {
    this.accountServiceService.getUserById(id).subscribe(
      async (data: account) => {

        this.Account = data;
        this.fillImage(await this.setImageURLFirebase(this.Account.avatar_url));
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  Reset(id: number) {


    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(this.Account?.birthday, 'yyyy-MM-dd') ?? '';
    const UpdateUserForAdmin: UpdateUserForAdmin = {

      fullname: this.Account.fullname,
      email: this.Account.email,
      Phone: this.Account.Phone,
      address: this.Account.address,
      avatar_url: this.Account.avatar_url,
      gender: this.Account.gender,
      password: this.Account.password,
      birthday: this.registerForm.form.controls['birthday'].value,
      active: true,
      createdDate: formattedDate,
      accountRole: this.Account.accountRole,
    };

    this.accountServiceService.getUserById(id).subscribe(
      async (data) => {

        console.log(data);
        this.accountServiceService.hot("unlock", data.email).subscribe(
          async (data) => {

            console.log(data);
            return;
          },
          (error) => {

            console.log(error);
            return;
          }
        );
        return;
      },
      (error) => {

        console.log(error);
        return;
      }
    );


    this.accountServiceService.UpdateActive(id, UpdateUserForAdmin).subscribe(
      async (data) => {


        if (this.imageFile) {
          await this.firebaseStorage.uploadFile(
            'adminManageImage/user/',
            this.imageFile
          );

        }
        this.toast.success({detail: 'Success Message', summary: 'Update successfully', duration: 3000});
        await this.getAllUsers(0, 10);
        this.Account = createAccount();
        this.removeUpload();


      },
      (error) => {

        this.toast.error({detail: 'Failed Message', summary: 'Update failed', duration: 3000});
        console.log(error);
        return;
      }
    );
  }


  deleteUser() {
    debugger
    if (this.account?.accountRole?.id == 2) {
      debugger
      const confirm = window.confirm('Are you sure?');
      if (confirm) {
        debugger
        this.accountServiceService.hot("delete", this.Account.email)
          .pipe(
            mergeMap(() => this.accountServiceService.deleteUser(this.Account.id!)),
            catchError(error => {
              debugger
              console.error('Error deleting user:', error);
              return of(null);
            })
          )
          .subscribe(data => {
            debugger
            if (data !== null) {
              debugger
              console.log(data);
              this.getAllUsers(0, 10);
            }
          });
        this.getAllUsers(0, 10);

      } else {
        debugger
        this.getAllUsers(0, 10);

        alert('Delete was denied!');
      }
    } else {
      alert("nhân viên không được phép xoá");
      // this.toast.warning({
      //   detail: 'Warning Message',
      //   summary: 'Only Administrator can use this Function',
      //   duration: 3000
      // });
    }
  }

  search(): void {
    const searchTermLowerCase = this.searchTerm.trim().toLowerCase();

    this.Accounts = this.Accounts.filter(singers =>
      // singers.fullname.toLowerCase().includes(searchTermLowerCase) ||
      singers.email.toLowerCase().includes(searchTermLowerCase)
    );


    if (searchTermLowerCase == '') {
      this.getAllUsers(0, 100);
    }
  }

  onKey(event: any): void {
    this.searchTerms.next(event.target.value);
  }


}
