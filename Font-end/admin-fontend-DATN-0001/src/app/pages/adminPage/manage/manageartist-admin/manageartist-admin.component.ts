import {CommonModule, DOCUMENT} from '@angular/common';
import {Component, ElementRef, Inject, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Singer} from '../../adminEntityService/adminEntity/singer/singer';
import {SingerService} from '../../adminEntityService/adminService/singer-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseStorageCrudService} from "../../../../services/firebase-storage-crud.service";
import {read} from 'node:fs';
import {NgToastModule, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-manageartist-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgToastModule],

  templateUrl: './manageartist-admin.component.html',
  styleUrl: './manageartist-admin.component.scss',
  providers: [NgToastService]
})
export class ManageartistAdminComponent {
  id!: number;
  singers: Singer[] = [];
  singer: Singer = new Singer();
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;
  pages: number[] = [];
  total: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  page: number = 1;
  itempage: number = 4;


  constructor(
    private singerService: SingerService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private toast: NgToastService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadSingers(0, 10);
    this.loadSingerById();
    this.getArtist(this.id);
  }

  loadSingers(page: number, limit: number) {
    this.singerService.getCategories(page, limit).subscribe(
      async (data) => {
        console.log(data);
        this.singers = data.content;

        for (const singer of this.singers) {
          if (singer.image == null || singer.image == '') {
            continue;
          }
          singer.image = await this.setImageURLFirebase(singer.image);
        }
        this.total = data.totalPages;
        this.visiblePages = this.PageArray(this.page, this.total);

      }
    );
  }

  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    this.loadSingers(this.page, this.itempage);
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



  private loadSingerById() {
    this.singerService.getArtistById(this.id).subscribe(
      (data) => {
        this.singer = data;
      },
      (error) => console.log(error)
    );
  }

  updateSinger(id: number) {
      console.log('001 === ' + this.singer.image);
      if (this.imageFile) {
        this.singer.image = this.setImageUrl;
      }

      if (!this.imageFile && !this.setImageUrl) {
        this.singer.image = 'adminManageImage/artist/null.jpg';
      }
    this.singerService.updateArtist(id, this.singer).subscribe(
      async (data) => {
        if (this.imageFile) {
          await this.firebaseStorage.uploadFile('adminManageImage/artist/', this.imageFile);
        }
        this.singer = new Singer();
        this.removeUpload();
        this.goToSingerList();
        console.log(data);
        this.toast.success({detail: 'Success Message', summary: 'Update successfully', duration: 3000});

      },
      (error) => {
        console.log(error)
        this.toast.error({detail: 'Failed Message', summary: 'Update failed', duration: 3000});
      }
    );

  }

  deleteSinger(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this singer?');
    if (isConfirmed) {
      this.singerService.deleteArtist(id).subscribe((data) => {
        console.log(data);
        this.loadSingers(0, 10);
      });
    }
  }

  saveSinger() {
    this.singer.image = this.setImageUrl;
    if (!this.setImageUrl || !this.imageFile) {
      this.singer.image = 'adminManageImage/genre/null.jpg';
    }
    this.singerService.createArtist(this.singer).subscribe(
      async (data) => {
        if (this.imageFile) {
          await this.firebaseStorage.uploadFile('adminManageImage/artist/', this.imageFile);
        }
        this.singer = new Singer();
        this.removeUpload();
        this.goToSingerList();
        console.log(data);
        this.toast.success({detail: 'Success Message', summary: 'Adding successfully', duration: 3000});


      },
      (error) => {
        this.toast.error({detail: 'Error Message', summary: 'Adding failed', duration: 3000});
        console.log(error)
      }
    );

  }

  goToSingerList() {
    this.loadSingers(0, 10);
    this.router.navigate(['/manage/artist']);
  }

  onSubmit() {

    // if (this.id) {
    //   this.updateSinger(this.id);
    // } else {
    //   this.saveSinger();
    // }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 8 * 1024 * 1024; // giối hạn 25 MB
    if (selectedFile.size > maxSizeInBytes) {
      alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'File size access the allowed limit (8 MB). Please choose a smaller file.',
        duration: 5000
      })
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

  resetFileInput(): void {
    // Đặt lại giá trị của input file
    const fileInput: any = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
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
