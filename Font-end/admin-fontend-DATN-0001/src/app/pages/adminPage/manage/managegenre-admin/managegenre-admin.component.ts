import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Genre} from "../../adminEntityService/adminEntity/genre/genre";
import {GenreServiceService} from "../../adminEntityService/adminService/genre-service.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseStorageCrudService} from "../../../../services/firebase-storage-crud.service";
import {typeCheckFilePath} from "@angular/compiler-cli/src/ngtsc/typecheck";
import {from, Observable} from "rxjs";

@Component({
  selector: 'app-managegenre-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './managegenre-admin.component.html',
  styleUrl: './managegenre-admin.component.scss'
})
export class ManagegenreAdminComponent implements OnInit {
  id!: number;
  Genre: Genre[] = [];
  Genree: Genre = new Genre();
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;

  constructor
  (private GenreService: GenreServiceService,
   private router: Router,
   private route: ActivatedRoute,
   private el: ElementRef,
   private renderer: Renderer2,
   protected firebaseStorage: FirebaseStorageCrudService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getEmployees();
    this.loadSingerById();

  }

  onFileSelected(event: any) {
    const archivoSelectcionado: File = event.target.files[0];
    console.log("FILE OBJECT ==> ", archivoSelectcionado);
    if (archivoSelectcionado) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.renderer.setStyle(this.el.nativeElement.querySelector('.image-upload-wrap'), 'display', 'none');
        this.renderer.setAttribute(this.el.nativeElement.querySelector('.file-upload-image'), 'src', e.target.result);
        this.renderer.setStyle(this.el.nativeElement.querySelector('.file-upload-content'), 'display', 'block');
      };
      this.setImageUrl = 'adminManageImage/genre/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.removeUpload();
    }
  }

  removeUpload(): void {
    this.imageUrl = '';
    this.renderer.setProperty(this.el.nativeElement.querySelector('.file-upload-input'), 'value', '');
    this.renderer.setStyle(this.el.nativeElement.querySelector('.file-upload-content'), 'display', 'none');
    this.renderer.setStyle(this.el.nativeElement.querySelector('.image-upload-wrap'), 'display', 'block');
  }

  loadSingerById() {
    this.GenreService.getGenre(this.id).subscribe(
      (data) => {
        this.Genree = data;
      },
      (error) => console.log(error)
    );
  }


  getEmployees() {
    this.GenreService.getCategories(0, 10).subscribe(async data => {
      console.log(data);
      this.Genre = data.content;

      for (const genre of this.Genre) {
        genre.image = await this.firebaseStorage.getFile(genre.image);
      }
    });

  }

  goToSingerList() {
    this.getEmployees();
    this.router.navigate(['/manage/genre']);
  }

  saveGenre() {
    this.Genree.image = this.setImageUrl;
    this.GenreService.createGenre(this.Genree).subscribe(
      async (data) => {
        if (this.Genree.image != null) {
           await this.firebaseStorage.uploadFile('adminManageImage/genre/', this.imageFile);
        }
        console.log(data);
      },
      (error) => console.log(error)
    );


  }

  updateGender(id: number) {
    this.router.navigate(['update-genre', id]);
  }

  deleteGender(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this singer?');
    if (isConfirmed) {
      this.GenreService.deleteGenre(id).subscribe((data) => {
        console.log(data);
        this.getEmployees();
      });
    }
  }


  onSubmit() {
    this.saveGenre();
    this.goToSingerList();
    this.GenreService.updateGenre(this.id, this.Genree).subscribe(
      (data) => {
        this.goToSingerList();
      },
      (error) => console.log(error)
    );
  }


}
