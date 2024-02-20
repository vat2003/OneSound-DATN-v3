import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Genre } from '../../adminEntityService/adminEntity/genre/genre';
import { GenreServiceService } from '../../adminEntityService/adminService/genre-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseStorageCrudService } from '../../../../services/firebase-storage-crud.service';
import { error, log } from 'console';
import { NgToastModule, NgToastService } from "ng-angular-popup";

@Component({
  selector: 'app-managegenre-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink, NgToastModule],
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

  constructor(
    private GenreService: GenreServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private toast: NgToastService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getListGenresPage();
    this.loadSingerById();
    this.getGenre(this.id);
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
      this.setImageUrl = 'adminManageImage/genre/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = 'adminManageImage/genre/null.jpg';

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

  loadSingerById() {
    this.GenreService.getGenre(this.id).subscribe(
      (data) => {
        this.Genree = data;
      },
      (error) => console.log(error)
    );
  }

  getListGenresPage() {
    this.GenreService.getListGenres(0, 10).subscribe(async (data) => {
      console.log(data);
      this.GenresFromData = data.content;
      this.Genre = this.GenresFromData;

      for (const genre of this.Genre) {
        if (genre.image == '' || genre.image == null) {
          continue;
        }
        genre.image = await this.setImageURLFirebase(genre.image);
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

  goToSingerList() {
    this.getListGenresPage();
    this.router.navigate(['/manage/genre']);
  }

  saveGenre() {
    debugger
    if (this.errorFieldsArr.length !== 0) {
      this.toast.warning({ detail: 'Warning Message', summary: 'Name is null', duration: 5000 });
      return;
    }
    if (this.isNameExistsInArray(this.Genree)) {
      // alert('The name of the music genre already exists');
      this.toast.warning({ detail: 'Warning Message', summary: 'Name is exists', duration: 5000 });
      this.errorFieldsArr.push('existGenreName');
      return;
    }
    //Set path ảnh được chọn từ Func onFileSelected()
    this.Genree.image = this.setImageUrl;
    this.errorFieldsArr = this.validateGenreEmpty(this.Genree);

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
        this.goToSingerList();
        console.log(data);
        this.toast.success({ detail: 'Success Message', summary: 'Adding successfully', duration: 3000 });
      },
      (error) => {
        console.log(error);
        this.toast.error({ detail: 'Failed Message', summary: 'Adding failed', duration: 3000 });

      }
    );
  }

  updateGenre(id: number) {
    console.log('001 === ' + this.Genree.image);
    if (this.imageFile) {
      this.Genree.image = this.setImageUrl;
    }

    if (!this.imageFile && !this.setImageUrl) {
      this.Genree.image = 'adminManageImage/genre/null.jpg';
    }
    console.log('002 === ' + this.Genree.image);
    this.GenreService.updateGenre(id, this.Genree).subscribe(
      async (data) => {
        if (this.imageFile) {
          await this.firebaseStorage.uploadFile(
            'adminManageImage/genre/',
            this.imageFile
          );
          console.log('003 === ' + this.Genree.image);
        }
        this.Genree = new Genre();
        console.log('004 === ' + this.Genree.image);
        this.goToSingerList();
        this.removeUpload();
        console.log(data);
        this.toast.success({ detail: 'Success Message', summary: 'Update successfully', duration: 3000 });
      },
      (error) => {
        console.log(error)
        this.toast.error({ detail: 'Failed Message', summary: 'Update failed', duration: 3000 });
      }
    );
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

    // this.Genree = this.router.navigate(['onesound/admin/manage/genre/', id]);
  }

  deleteGender(id: number) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this singer?'
    );
    if (isConfirmed) {
      this.GenreService.deleteGenre(id).subscribe((data) => {
        console.log(data);

        this.getListGenresPage();
      });
    }
  }

  onSubmit() {
    // if (this.id) {
    //   this.updateGender(this.id);
    // } else {
    //   this.saveGenre();
    // }
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
      return genre.name.includes(this.filterName);
    });
  }
}
