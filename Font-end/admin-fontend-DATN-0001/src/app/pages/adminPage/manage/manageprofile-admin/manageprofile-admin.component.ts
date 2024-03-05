import {CommonModule, DatePipe} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit, Renderer2, ElementRef} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {account} from '../../adminEntityService/adminEntity/account/account';
import {TokenService} from '../../adminEntityService/adminService/token.service';
import {UpdateUserDTO} from '../../adminEntityService/adminEntity/DTO/update.user.dto';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
import {NgToastModule, NgToastService} from 'ng-angular-popup';

@Component({
  selector: 'app-manageprofile-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule,
  ],

  templateUrl: './manageprofile-admin.component.html',
  styleUrl: './manageprofile-admin.component.scss'
})
export class ManageprofileAdminComponent implements OnInit {
  userResponse?: account;
  token: string = '';
  account?: account | null;
  userProfileForm: FormGroup;
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;
  submitted = false;
  errorFieldsArr: String[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: accountServiceService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef, private firebaseStorage: FirebaseStorageCrudService,
    private toast: NgToastService,
  ) {
    this.userProfileForm = this.formBuilder.group({

      fullname: ['', [Validators.required, Validators.maxLength(50)]],
      id: [''],
      email: [''],
      address: [''],
      createdDate: [''],
      birthday: [''],
      gender: true,
      avatar_url: [''],
      role_id: 1
    }, {});
  }

  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(this.account?.birthday, 'yyyy-MM-dd') ?? '';

    this.userProfileForm.patchValue({
      fullname: this.account?.fullname ?? '',
      id: this.account?.id ?? '',
      email: this.account?.email ?? '',
      birthday: formattedDate,
      address: this.account?.address ?? '',
      avatar_url: this.account?.avatar_url ?? '',
      gender: this.account?.gender ?? true,
      createdDate: formattedDate,
      role_id: this.account?.accountRole
    });

    // this.setImage(this.userProfileForm.value);

  }

  async setImage(avatar_url: string) {
    this.fillImage(await this.setImageURLFirebase(avatar_url));
  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
    console.log(this.userProfileForm);


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
      birthday: this.userProfileForm.get('birthday')?.value,
      role_id: this.userProfileForm.get('role_id')?.value
    };
    // //Trong lúc lưu đối tượng vào Database thì đồng thời Set path và file ảnh lên Firebase
    // if (this.imageFile) {
    //   await this.firebaseStorage.uploadFile(
    //     'adminManageImage/profile/',
    //     this.imageFile
    //   );
    //   updateUserDTO.avatar_url = 'adminManageImage/profile/' + this.imageFile.name;
    //   console.log('UPLOAD IMG FILE ==> adminManageImage/profile/' + this.imageFile.name);
    if (this.userProfileForm.get('fullname')?.value === null || this.userProfileForm.get('fullname')?.value.trim() === '') {
      alert('Full name cannot be empty.');
      return; // Stop the function execution if full name is empty
    }


    this.userService.UpdateProfile(updateUserDTO)
      .subscribe({

        next: (response: any) => {
          //Trong lúc lưu đối tượng vào Database thì đồng thời Set path và file ảnh lên Firebase
          // if (this.imageFile) {
          //   await this.firebaseStorage.uploadFile(
          //     'adminManageImage/profile/',
          //     this.imageFile
          //   );
          // }
          // debugger

          this.router.navigate(['/onesound/dangnhap']);
          console.log(response);

          alert('update profile successfully');


        },
        error: (error: any) => {
          debugger
          alert(error.error.message);
        }
      });
  }

  onFileSelected(event: any) {
    const archivoSelectcionado: File = event.target.files[0];
    console.log('FILE OBJECT ==> ', archivoSelectcionado);
    if (archivoSelectcionado) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.fillImage(this.imageUrl);
      };
      //Set path ảnh theo thư mục
      this.setImageUrl = 'adminManageImage/profile/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = 'adminManageImage/profile/null.jpg';

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
}

