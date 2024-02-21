import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-managesong-admin',
  standalone: true,
  imports: [],
  templateUrl: './managesong-admin.component.html',
  styleUrl: './managesong-admin.component.scss',
})
export class ManagesongAdminComponent {
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

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
      this.setImageUrl = '/asset/img/song/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = 'asset/img/song/null.jpg';

      this.removeUpload();
    }
  }

  onFileSelectedAudio(event: any) {
    const archivoSelectcionado: File = event.target.files[0];
    console.log('FILE OBJECT ==> ', archivoSelectcionado);
    if (archivoSelectcionado) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.fillImage(this.imageUrl);
      };
      //Set path ảnh theo thư mục
      this.setImageUrl = '/asset/audio/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = '/asset/audio/null.mp3';

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

  create() {
    alert(this.setImageUrl);
  }
}
