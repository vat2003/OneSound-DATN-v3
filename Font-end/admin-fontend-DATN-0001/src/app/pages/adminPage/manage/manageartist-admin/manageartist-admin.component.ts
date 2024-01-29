import {CommonModule} from '@angular/common';
import {Component, ElementRef, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Singer} from '../../adminEntityService/adminEntity/singer/singer';
import {SingerService} from '../../adminEntityService/adminService/singer-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseStorageCrudService} from "../../../../services/firebase-storage-crud.service";

@Component({
  selector: 'app-manageartist-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './manageartist-admin.component.html',
  styleUrl: './manageartist-admin.component.scss'
})
export class ManageartistAdminComponent {
  id!: number;
  singers: Singer[] = [];
  singer: Singer = new Singer();
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;

  constructor(
    private singerService: SingerService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadSingers();
    this.loadSingerById();
    this.getArtist(this.id);
  }

  loadSingers() {
    this.singerService.getCategories(0, 10).subscribe(
      async (data) => {
        console.log(data);
        this.singers = data.content;

        for (const singer of this.singers) {
          if (singer.image == null || singer.image == '') {
            continue;
          }
          singer.image = await this.setImageURLFirebase(singer.image);
        }

      }
    );
  }

  private loadSingerById() {
    this.singerService.getArtistById(this.id).subscribe(
      (data) => {
        this.singer = data;
      },
      (error) => console.log(error)
    );
  }

  updateSinger(id: number) {
    this.singer.image = this.setImageUrl;
    this.singerService.updateArtist(id, this.singer).subscribe(
      async (data) => {
        if (this.singer.image != null && this.singer.image != 'null') {
          await this.firebaseStorage.uploadFile('adminManageImage/artist/', this.imageFile);
        }
        this.singer = new Singer();
        this.removeUpload();
        this.goToSingerList();
        console.log(data);
      },
      (error) => console.log(error)
    );

  }

  deleteSinger(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this singer?');
    if (isConfirmed) {
      this.singerService.deleteArtist(id).subscribe((data) => {
        console.log(data);
        this.loadSingers();
      });
    }
  }

  saveSinger() {
    this.singer.image = this.setImageUrl;
    this.singerService.createArtist(this.singer).subscribe(
      async (data) => {
        if (this.singer.image != null) {
          await this.firebaseStorage.uploadFile('adminManageImage/artist/', this.imageFile);
        }this.goToSingerList();
        console.log(data);
      },
      (error) => console.log(error)
    );

  }

  goToSingerList() {
    this.loadSingers();
    this.router.navigate(['/manage/artist']);
  }

  onSubmit() {
    // this.saveSinger();
    // this.goToSingerList();
    // this.singerService.updateArtist(this.id, this.singer).subscribe(
    //   (data) => {
    //     this.goToSingerList();
    //   },
    //   (error) => console.log(error)
    // );
    if (this.id) {
      this.updateSinger(this.id);
    } else {
      this.saveSinger();
    }
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
      this.setImageUrl = 'adminManageImage/artist/' + archivoSelectcionado.name;
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

  getArtist(id: number) {
    this.singerService.getArtistById(id).subscribe(
      async (data: Singer) => {
        this.singer = data;
        this.fillImage(await this.setImageURLFirebase(this.singer.image));
      },
      (error: any) => {
        console.log(error);
      }
    )
    // this.Genree = this.router.navigate(['onesound/admin/manage/genre/', id]);
  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

}
