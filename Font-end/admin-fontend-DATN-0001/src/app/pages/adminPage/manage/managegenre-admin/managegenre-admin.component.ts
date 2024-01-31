import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Genre } from '../../adminEntityService/adminEntity/genre/genre';
import { GenreServiceService } from '../../adminEntityService/adminService/genre-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseStorageCrudService } from '../../../../services/firebase-storage-crud.service';
import { error, log } from 'console';

@Component({
  selector: 'app-managegenre-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './managegenre-admin.component.html',
  styleUrl: './managegenre-admin.component.scss',
})
export class ManagegenreAdminComponent implements OnInit {
  id!: number;
  Genre: Genre[] = [];
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
    private firebaseStorage: FirebaseStorageCrudService
  ) {}

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
      this.setImageUrl = 'adminManageImage/genre/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
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
      this.Genre = data.content;

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
    this.Genree.image = this.setImageUrl;
    this.errorFieldsArr = this.validateGenreEmpty(this.Genree);
    if (this.errorFieldsArr.length !== 0) {
      return;
    }
    if (this.isNameExistsInArray(this.Genree)) {
      alert('The name of the music genre already exists');
      this.errorFieldsArr.push('existGenreName');
      return;
    }

    this.GenreService.createGenre(this.Genree).subscribe(
      async (data) => {
        if (this.Genree.image != null) {
          await this.firebaseStorage.uploadFile(
            'adminManageImage/genre/',
            this.imageFile
          );
        }
        this.goToSingerList();
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  updateGenre(id: number) {
    this.Genree.image = this.setImageUrl;
    this.GenreService.updateGenre(id, this.Genree).subscribe(
      async (data) => {
        if (this.Genree.image != null && this.Genree.image != 'null') {
          await this.firebaseStorage.uploadFile(
            'adminManageImage/genre/',
            this.imageFile
          );
        }
        this.goToSingerList();
        this.Genree = new Genre();
        this.removeUpload();
        this.goToSingerList();
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  getGenre(id: number) {
    this.GenreService.getGenre(id).subscribe(
      async (data: Genre) => {
        this.Genree = data;
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
    return this.Genre.some((genre) => genre.name === genreCheck.name);
  }
}
