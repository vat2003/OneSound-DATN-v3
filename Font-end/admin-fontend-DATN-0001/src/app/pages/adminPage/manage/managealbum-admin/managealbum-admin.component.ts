import {Component, ElementRef, Renderer2} from '@angular/core';


@Component({
  selector: 'app-managealbum-admin',
  standalone: true,
  imports: [],
  templateUrl: './managealbum-admin.component.html',
  styleUrl: './managealbum-admin.component.scss'
})
export class ManagealbumAdminComponent {


  imageUrl: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
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
}
