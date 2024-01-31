import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {account, createAccount} from '../../adminEntityService/adminEntity/account/account';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
// import { Role } from '../../adminEntityService/adminEntity/Role/Role';
import {RoleService} from '../../adminEntityService/adminService/role.service';
import {Role} from '../../adminEntityService/adminEntity/Role/Role';
import {Observable} from "rxjs";


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

  constructor(
    private accountServiceService: accountServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private RoleService: RoleService
  ) {


  }

  getAllRole() {
    // this.RoleService.getAllRolesPages(1).subscribe(
    //   (data) => {
    //     this.Roles = data;
    //     console.log(this.Roles);
    //   }
    //   );
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
    this.getPages();
    this.getUser(this.id);
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


  getPages() {
    this.accountServiceService.getPages(1, 10).subscribe(
      async data => {
        console.log("asdasd" + data);
        this.Accounts = data.content;

        for (const account of this.Accounts) {
          if (account.avatar_url == "" || account.avatar_url == null) {
            continue;
          }
          account.avatar_url = await this.setImageURLFirebase(account.avatar_url);
        }
      });

  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

  goToUserList() {
    this.getPages();
    this.router.navigate(['/manage/users']);
  }

  saveUsers() {
    this.Account.avatar_url = this.setImageUrl;
    this.accountServiceService.createAccount(this.Account).subscribe(
      async (data) => {
        if (this.Account.avatar_url != null) {
          await this.firebaseStorage.uploadFile('adminManageImage/users/', this.imageFile);
        }
        this.goToUserList();
        console.log(data);
      },
      (error) => console.log(error)
    );

  }



  updateUser(id: number) {
    this.Account.avatar_url = this.setImageUrl;
    this.accountServiceService.updateUser(id, this.Account).subscribe(
      async (data) => {
        if (this.Account.avatar_url != null && this.Account.avatar_url != 'null') {
          await this.firebaseStorage.uploadFile('adminManageImage/users/', this.imageFile);
        }
        this.goToUserList();
        this.Account = createAccount();
        this.removeUpload();
        // this.goToSingerList();
        console.log(data);
      },
      (error) => console.log(error)
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

  deleteGender(id: number) {
    const isConfirmed = window.confirm('Are you sure to delete this User?');
    if (isConfirmed) {
      this.accountServiceService.deleteUser(id).subscribe((data) => {
        console.log(data);
        this.getPages();
      });
    }
  }


}
