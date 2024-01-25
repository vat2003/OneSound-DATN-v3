import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadViewImageServiceService {

  constructor() {
  }

  // private _imageUrl: string = '';


  // onFileSelected(event: any) {
  //   const selectedFile: File = event.target.files[0];
  //   console.log('FILE OBJECT ==>', selectedFile);
  //
  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this._imageUrl = e.target.result;
  //       this.emitFileSelectedEvent(this.imageUrl);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   } else {
  //     this.removeUpload();
  //   }
  // }
  //
  // removeUpload() {
  //   this._imageUrl = '';
  //   this.emitFileRemovedEvent();
  // }
  //
  // // Event emitters to notify components of changes
  // private fileSelectedEvent = new EventEmitter<string>();
  // private fileRemovedEvent = new EventEmitter<void>();
  // // Observables for components to subscribe to
  // imageSelected = new EventEmitter<string>();
  // imageRemoved = new EventEmitter<void>();
  //
  // emitFileSelectedEvent(imageUrl: string) {
  //   this.fileSelectedEvent.emit(imageUrl);
  // }
  //
  // emitFileRemovedEvent() {
  //   this.fileRemovedEvent.emit();
  // }
  //
  // // Getter for the image URL
  // get imageUrl(): string {
  //   return this._imageUrl;
  // }
}
