import { accountServiceService } from '../../adminEntityService/adminService/account-service.service';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { account, createAccount } from '../../adminEntityService/adminEntity/account/account';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseStorageCrudService } from '../../../../services/firebase-storage-crud.service';
import { RoleService } from '../../adminEntityService/adminService/role.service';
import { Role } from '../../adminEntityService/adminEntity/Role/Role';
import { UpdateUserForAdmin } from '../../adminEntityService/adminEntity/DTO/UpdateUserForAdmin';


import { mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manageuser-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage,
    RouterLink],
  templateUrl: './manageuser-admin.component.html',
  styleUrl: './manageuser-admin.component.scss'
})
export class ManageuserAdminComponent implements OnInit {
  id!: number;
  // UpdateUserForAdmin: UpdateUserForAdmin =createUpdateUserForAdmin();
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
  page: number = 1;
  // itempage: number = 2;
  itempage: number = 3;
  selectedUser: account = createAccount();



  constructor(
    private accountServiceService: accountServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private RoleService: RoleService,
    private userService: accountServiceService,

  ) {


  }

  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    this.getAllUsers(this.page, this.itempage);
  }


  getAllUsers(page: number, limit: number) {
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
    this.getAllUsers(0, 3)

    this.getAllRole();



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
      (data: account) => {
        
        this.Account = data;
        this.formatDate(this.Account.createdDate)

      },
      (error: any) => {
        
        console.log(error);
      }
    );
  }
  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return '';
    }
    const formattedDate = typeof date === 'string' ? date : date.toISOString();
    return new DatePipe('en-US').transform(formattedDate, 'yyyy-MM-dd') || '';
  }

  updateUser() {
    
    if (this.Account.id !== undefined) {
      
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

      this.accountServiceService.updateUser(this.Account.id, UpdateUserForAdmin).subscribe(
        async (data) => {
         
          console.log(data);
        },
        (error) => {         
          console.log(error);
        }
      );

      if (UpdateUserForAdmin.active == false) {
        const shouldLock = confirm("Bạn có muốn khoá tài khoản không?");
        if (shouldLock) {
          debugger
          this.accountServiceService.hot("Tài Khoảng Của Bạn Đã Bị  Khoá", UpdateUserForAdmin.email).subscribe(
            async (data) => {
              debugger
              console.log(data);  
            },
            (error) => {
              debugger
              console.log(error);    
                   
            }
          );
        }else{
          console.log("huỷ thao tác khoá");
          return;
        }
       
      }else{
        const shouldLock = confirm("Bạn có muốn mở tài khoản không?");
        if (shouldLock) {
          debugger
        this.accountServiceService.hot("Tài Khoảng Của Bạn Đã Được Mở Khoá", UpdateUserForAdmin.email).subscribe(
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
        }else{
          alert("huỷ thao tác mở")
          return
        }
        
      }
                
    } else {     
      console.error("ID is undefined");
    }
  }


  saveUsers() {
    this.Account.avatar_url = this.setImageUrl;
    this.accountServiceService.createAccount(this.Account).subscribe(

      async (data) => {
        this.goToUserList();
        console.log("Update successfully");
        alert('Update successfully');
      },
      (error) => {

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
    this.accountServiceService.hot("Tài Khoảng Của Bạn Đã Bị xoá khỏi hệ thống", this.Account.email)
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
          this.getAllUsers(0, 4);
        }
      });
  }  
}
