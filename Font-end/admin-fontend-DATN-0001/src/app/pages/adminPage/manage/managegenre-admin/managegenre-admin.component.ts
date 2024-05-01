import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Genre} from '../../adminEntityService/adminEntity/genre/genre';
import {GenreServiceService} from '../../adminEntityService/adminService/genre-service.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
import {error, log} from 'console';
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {account} from '../../adminEntityService/adminEntity/account/account';
import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';
import {NgxPaginationModule} from "ngx-pagination";

@Component({
  selector: 'app-managegenre-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink, NgToastModule, NgxPaginationModule],
  templateUrl: './managegenre-admin.component.html',
  styleUrl: './managegenre-admin.component.scss',
})
export class ManagegenreAdminComponent implements OnInit {
  id!: number;
  Genre: Genre[] = [];
  GenresFromData: Genre[] = [];
  filterName: string = '';
  Genree: Genre = new Genre();
  GenreeByName: any;
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;
  submitted = false;
  errorFieldsArr: String[] = [];
  pages: number[] = [];
  page: number = 1;
  total: number = 0;
  itempage: number = 6;
  visiblePages: number[] = [];
  localStorage?: Storage;
  account?: account | null;
  pU: number = 1;
  pI: number = 1;
  pageSize: number = 5;

  constructor(
    private GenreService: GenreServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private toast: NgToastService,
    private accountServiceService: accountServiceService,
  ) {
  }

  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    // this.displayDataOnTable(this.page, this.itempage);
    this.getListGenresPage(this.page, this.itempage);

  }

  PageArray(page: number, total: number): number[] {
    const maxVisiblePages = 6;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(page - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, total);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  ngOnInit(): void {
    this.account = this.accountServiceService.getUserResponseFromLocalStorage();
    this.id = this.route.snapshot.params['id'];
    this.getListGenresPage(0, 10000);
    this.loadSingerById();
    this.getGenre(this.id);
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
      // alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'File size axceeds the allowed limit (8 MB). Please choose a smaller file.',
        duration: 5000
      });

      this.resetFileInput();
      return;
    }

    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      // alert('Please select an image file.');
      this.toast.warning({detail: 'Warning Message', summary: 'Please select an image file.', duration: 5000});

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
    debugger
    console.log('FILE OBJECT ==> ', archivoSelectcionado);
    if (archivoSelectcionado) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.fillImage(this.imageUrl);
      };
      //Set path ảnh theo thư mục
      debugger
      this.setImageUrl = 'adminManageImage/genre/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      debugger
      this.setImageUrl = 'adminManageImage/genre/null.jpg';
      this.removeUpload();
    }
  }

  fillImage(url: string): void {
    debugger
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
    debugger
    if (url.length == 0) {
      this.removeUpload();
    }
  }

  removeUpload(): void {
    debugger
    this.imageUrl = '';
    this.setImageUrl = '';
    // this.imageFile = null;
    debugger
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

  loadSingerById() {
    this.GenreService.getGenre(this.id).subscribe(
      (data) => {
        this.Genree = data;
      },
      (error) => console.log(error)
    );
  }

  getListGenresPage(page: number, limit: number) {
    this.GenreService.getListGenres(page, limit).subscribe(async (data) => {
      console.log(data);
      this.GenresFromData = data.content;

      this.Genre = this.GenresFromData;

      for (const genre of this.Genre) {
        if (genre.image == '' || genre.image == null) {
          continue;
        }
        genre.image = await this.setImageURLFirebase(genre.image);
      }
      this.total = data.totalPages;
      this.visiblePages = this.PageArray(this.page, this.total);

    });
  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

  goToSingerList() {
    this.getListGenresPage(0, 4);
    this.router.navigate(['/manage/genre']);
  }

  saveGenre() {
    debugger
    if (this.errorFieldsArr.length !== 0) {
      this.toast.warning({detail: 'Warning Message', summary: 'Name is null', duration: 5000});
      return;
    }

    if (this.isNameExistsInArray(this.Genree)) {
      // alert('The name of the music genre already exists');
      this.toast.warning({detail: 'Warning Message', summary: 'Name is exists', duration: 5000});
      this.errorFieldsArr.push('existGenreName');
      return;
    }
    debugger
    //Set path ảnh được chọn từ Func onFileSelected()
    this.Genree.image = this.setImageUrl;
    this.errorFieldsArr = this.validateGenreEmpty(this.Genree);
    if (!this.Genree.name) {
      this.toast.warning({detail: 'Warning Message', summary: 'Name is null', duration: 5000});
      return;
    }
    if (!this.setImageUrl || !this.imageFile) {
      this.Genree.image = 'adminManageImage/genre/null.jpg';
    }
    this.GenreService.createGenre(this.Genree).subscribe(
      async (data) => {
        //Trong lúc lưu đối tượng vào Database thì đồng thời Set path và file ảnh lên Firebase
        if (this.imageFile) {
          await this.firebaseStorage.uploadFile(
            'adminManageImage/genre/',
            this.imageFile
          );
        }
        this.Genree = new Genre();
        this.removeUpload();
        //Load lại table
        // this.goToSingerList();
        this.ngOnInit();
        console.log(data);
        this.toast.success({detail: 'Success Message', summary: 'Adding successfully', duration: 3000});
      },
      (error) => {
        console.log(error);
        this.toast.error({detail: 'Failed Message', summary: 'Adding failed', duration: 3000});

      }
    );
  }

  updateGenre(id: number) {

    if (this.account?.accountRole?.id == 2) {
      if (this.imageFile) {
        this.Genree.image = this.setImageUrl;
      }

      if (!this.imageFile && !this.setImageUrl || this.imageFile == '' && this.setImageUrl == '') {
        this.Genree.image = 'adminManageImage/genre/null.jpg';
      }

      this.GenreService.updateGenre(id, this.Genree).subscribe(
        async (data) => {
          if (this.imageFile) {
            await this.firebaseStorage.uploadFile(
              'adminManageImage/genre/',
              this.imageFile
            );
          }
          this.Genree = new Genre();

          // this.goToSingerList();
          this.ngOnInit();
          this.removeUpload();
          console.log(data);
          this.toast.success({detail: 'Success Message', summary: 'Update successfully', duration: 3000});
        },
        (error) => {
          console.log(error)
          this.toast.error({detail: 'Failed Message', summary: 'Update failed', duration: 3000});
        }
      );
    } else {
      // alert("nhân viên không được phép update")
      this.toast.error({detail: 'Failed Message', summary: 'Only Administrator can use this Function', duration: 3000});


    }


  }

  getGenre(id: number) {
    this.GenreService.getGenre(id).subscribe(
      async (data: Genre) => {
        this.Genree = data;
        this.setImageUrl = this.Genree.image;
        this.fillImage(await this.setImageURLFirebase(this.Genree.image));
      },
      (error: any) => {
        console.log(error);
      }
    );

  }

  deleteGender(id: number) {
    if (this.account?.accountRole?.id == 2) {
      const isConfirmed = window.confirm('Are you sure you want to delete this singer?');
      if (isConfirmed) {
        this.GenreService.deleteGenre(id).subscribe((data) => {
            console.log(data);
            // this.getListGenresPage(0, 4);
            this.ngOnInit();
            this.toast.success({detail: 'Success Message', summary: 'Delete Successfully', duration: 5000});
          }, (error) => {
            this.toast.error({detail: 'Error Message', summary: 'Delete Failed', duration: 5000});
          }
        );
      }
    } else {
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'Only Administrator can use this Function',
        duration: 5000
      });
    }
  }

  onSubmit() {
  }

  validateGenreEmpty(valueCheck: any): string[] {
    const errorFieldsArr: string[] = [];
    for (const key in valueCheck) {
      if (valueCheck.hasOwnProperty(key)) {
        if (!valueCheck[key]) {
          //valueCheck[key] là giá trị
          //key là tên thuộc tính
          errorFieldsArr.push(key);
        }
      }
    }
    //return nếu không lỗi
    return errorFieldsArr;
  }

  isNameExistsInArray(genreCheck: Genre): boolean {
    return this.GenresFromData.some((genre) => genre.name === genreCheck.name);
  }

  filterName_Search() {
    this.Genre = this.GenresFromData.filter((genre: Genre) => {
      return genre.name.toLowerCase().includes(this.filterName.toLowerCase());
    });
  }
}
