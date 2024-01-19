import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() {
  }

  readURL(input: HTMLInputElement): void {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as FileReader;
        const result = target.result as string;

        // Replace jQuery syntax with Angular's native methods
        const imageUploadWrap = input.parentElement?.querySelector('.image-upload-wrap');
        const fileUploadImage = input.parentElement?.querySelector('.file-upload-image');
        const fileUploadContent = input.parentElement?.querySelector('.file-upload-content');
        const imageTitle = input.parentElement?.querySelector('.image-title');
        // if (imageUploadWrap && fileUploadImage && fileUploadContent && imageTitle) {
        //   imageUploadWrap.style.display = 'none';
        //   fileUploadImage.setAttribute('src', result);
        //   fileUploadContent.style.display = 'block';
        //   imageTitle.innerHTML = input.files[0].name;
        // }
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      // Assuming you have a removeUpload function
      // Call it if there are no files selected
      // removeUpload();
    }
  }
  
}
