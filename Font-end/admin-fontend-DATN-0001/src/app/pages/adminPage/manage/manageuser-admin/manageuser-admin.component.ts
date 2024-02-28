import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {account, createAccount} from '../../adminEntityService/adminEntity/account/account';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
import {RoleService} from '../../adminEntityService/adminService/role.service';
import {Role} from '../../adminEntityService/adminEntity/Role/Role';
import {UpdateUserForAdmin} from '../../adminEntityService/adminEntity/DTO/UpdateUserForAdmin';


import {mergeMap, catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject, of} from 'rxjs';

@Component({
  selector: 'app-manageuser-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage,
    RouterLink],
  templateUrl: './manageuser-admin.component.html',
  styleUrl: './manageuser-admin.component.scss'
})
export class ManageuserAdminComponent implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm;
  id!: number;
  Account: account = createAccount();
  Accounts: account[] = [];
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
  searchTerm: string = '';
  titleAlbum: string[] = [];

  private searchTerms = new Subject<string>();


  constructor(
    private accountServiceService: accountServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private RoleService: RoleService,
  ) {


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
  }

  Count(role: string) {
    console.log("Đã click nhưng đếu ăn" + Role)
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getAllUsers(0, 10);

    this.getAllRole();


    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.accountServiceService.getAllAlbumByAuthorByName(term, 0, 10))
      )
      .subscribe(async (data) => {

      });
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

  onFileSelected(event: any) {
    const archivoSelectcionado: File = event.target.files[0];
    console.log("FILE OBJECT ==> ", archivoSelectcionado);
    if (archivoSelectcionado) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.fillImage(this.imageUrl);
      };
      this.setImageUrl = 'adminManageImage/user/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.removeUpload();
    }
  }

  fillImage(url: string): void {
    this.renderer.setStyle(this.el.nativeElement.querySelector('.image-upload-wrap'), 'display', 'none');
    this.renderer.setAttribute(this.el.nativeElement.querySelector('.file-upload-image'), 'src', url);
    this.renderer.setStyle(this.el.nativeElement.querySelector('.file-upload-content'), 'display', 'block');
    if (url.length == 0) {
      this.removeUpload();
    }
  }

  removeUpload(): void {
    this.imageUrl = '';
    this.renderer.setProperty(this.el.nativeElement.querySelector('.file-upload-input'), 'value', '');
    this.renderer.setStyle(this.el.nativeElement.querySelector('.file-upload-content'), 'display', 'none');
    this.renderer.setStyle(this.el.nativeElement.querySelector('.image-upload-wrap'), 'display', 'block');
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

  goToUserList() {
    this.getAllUsers(0, 4);
    this.router.navigate(['/manage/users']);
  }

  view(id: number) {

    this.accountServiceService.getUserById(id).subscribe(
      async (data: account) => {
        // this.formatDate(data.birthday);
        this.Account = data;
        this.formatDate(this.Account.birthday);
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
  formatDate(date: Date | string | undefined): string {
    // Kiểm tra xem date có tồn tại không
    if (!date) {
      return '';
    }

    // Kiểm tra xem date có phải là một đối tượng Date hợp lệ không
    if (!(date instanceof Date)) {
      // Nếu không phải, kiểm tra xem date có phải là một chuỗi ngày hợp lệ không
      if (typeof date === 'string' && isNaN(Date.parse(date))) {
        return '';
      }
      // Nếu là chuỗi ngày hợp lệ, chuyển đổi nó thành một đối tượng Date
      date = new Date(date);
    }

    // Sử dụng DatePipe để chuyển đổi ngày thành định dạng "yyyy-MM-dd"
    return new DatePipe('en-US').transform(date, 'MM/dd/yyyy') || '';
  }


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
    debugger
    if (this.registerForm.valid) {
      if (!this.Account.fullname
        || !this.Account.email
      ) {
        alert("Vui lòng điền đầy đủ thông tin người dùng.");
        return;
      }
    }

    debugger
    if (this.Account.id !== undefined) {
      // if (this.Account.birthday == undefined) {
      //   alert("Please fill up the form!");
      //   return;
      // }
      this.Account.avatar_url = this.setImageUrl;
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
        active: this.Account.active,
        createdDate: formattedDate,
        accountRole: this.Account.accountRole
      };
      debugger
      this.accountServiceService.updateUser(this.Account.id, UpdateUserForAdmin).subscribe(
        async (data) => {
          debugger
          if (this.Account.avatar_url != null && this.Account.avatar_url != 'null') {
            await this.firebaseStorage.uploadFile(
              'adminManageImage/user/',
              this.imageFile
            );
            await this.getAllUsers(0, 10);
          }
          alert('Update user successfully!');
          this.Account = createAccount();
          this.removeUpload();

          console.log(data);

        },
        (error) => {
          alert('Update user failed!')
          console.log(error);
        }
      );

    } else {
      console.error("ID is undefined");
    }

  }

  setActiveStatus(UpdateUserForAdmin: account) {
    debugger
    const activeStatus = this.registerForm.form.controls['active'].value;
    if (UpdateUserForAdmin.active != activeStatus) {
      const shouldLock = window.confirm("Do you want to block your account?");
      if (shouldLock) {
        this.accountServiceService.hot("Your account has been locked", UpdateUserForAdmin.email).subscribe(
          async (data) => {
            debugger
            console.log(data);
            alert('Update user successfully!')
          },
          (error) => {
            debugger
            alert('Update user failed!')
            console.log(error);

          }
        );
      } else {
        console.log("Cancel the lock operation");
        return;
      }

    } else {
      const shouldLock = window.confirm("Do you want to active this account?");
      if (shouldLock) {
        debugger
        this.accountServiceService.hot("Your account has been unlocked", UpdateUserForAdmin.email).subscribe(
          async (data) => {
            debugger
            //  this.ngOnInit();
            console.log(data);
            return;
          },
          (error) => {
            debugger
            console.log(error);
            return;
          }
        );
      } else {
        alert("cancel the open operation")
        return
      }

    }
  }

  saveUsers() {


    debugger
    this.Account.avatar_url = this.setImageUrl;
    alert(this.Account)
    this.accountServiceService.createAccount(this.Account).subscribe(
      async (data) => {
        debugger
        this.goToUserList();
        console.log("Update successfully");
        alert('Update successfully');
      },
      (error) => {
        debugger
        console.log("FAILED" + error);
        alert('Update failed');

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
    // this.Genree = this.router.navigate(['onesound/admin/manage/genre/', id]);
  }


  deleteUser() {
    const confirm = window.confirm('Are you sure?');
    if (confirm) {
      this.accountServiceService.hot("Tài Khoản Của Bạn Đã Bị xoá khỏi hệ thống", this.Account.email)
        .pipe(
          mergeMap(() => this.accountServiceService.deleteUser(this.Account.id!)),
          catchError(error => {
            console.error('Error deleting user:', error);
            return of(null); // Trả về một observable với giá trị là null nếu có lỗi
          })
        )
        .subscribe(data => {
          if (data !== null) {
            console.log(data);
            this.getAllUsers(0, 10);
          }
        });
    } else {
      alert('Delete was denied!');
    }
  }

  search(): void {
    const searchTermLowerCase = this.searchTerm.trim().toLowerCase();

    this.Accounts = this.Accounts.filter(singers =>
      singers.fullname.toLowerCase().includes(searchTermLowerCase) ||
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
