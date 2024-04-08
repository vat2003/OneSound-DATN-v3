import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {deleteObject, getDownloadURL, getMetadata, ref, Storage, uploadBytesResumable} from "@angular/fire/storage";
import {listAll} from "firebase/storage";


@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageCrudService {

  constructor(
    // private firestore: AngularFirestore
  ) {

  }

  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;
  private storage: Storage = inject(Storage);

  async uploadFile(folderName: string, file: File): Promise<void> {
    const filePath = folderName + `/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file);

    uploadFile.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Uploading Progress ... ', progress, '%');
      },
      (error) => {
        console.error('Error ... ', error);
      },
      async () => {
        console.log(file.name);
        const url = await getDownloadURL(fileRef);
        console.log('LINK =>> ', url);
      })
  }

  async uploadFile2(folderName: string, file: File): Promise<any> {
    const filePath = folderName + `/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file);
    return new Promise((resolve,reject) => {
      uploadFile.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Uploading Progress ... ', progress, '%');
      },
      (error) => {
        console.error('Error ... ', error);
      },
      async () => {
        console.log(file.name);
        const url = await getDownloadURL(fileRef);
        console.log('LINK =>> ', url);
        resolve(url)
      })
    })

  }






  async getAllFiles(folderPath: string): Promise<any> {
    // const folderPath = 'archivos'; // Specify the folder path you want to list files from
    const folderRef = ref(this.storage, folderPath);

    try {
      const fileList = await listAll(folderRef);
      console.log(fileList);
      for (const fileRef of fileList.items) {
        const downloadUrl = await getDownloadURL(fileRef);
        // console.log('File Download URL: ', downloadUrl);
        console.log("SERVICE LOADING... =>>" + fileRef.name);
      }
      return fileList;

    } catch (error) {
      console.error('Error listing files: ', error);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const fileRef = ref(this.storage, filePath);

    try {
      await deleteObject(fileRef);
      console.log('File deleted successfully:', filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error; // Re-throw the error for proper handling in components
    }
  }

  async getFileMetadata(filePath: string): Promise<{ name: string; size: number; type: any; lastModified: string }> {
    const fileRef = ref(this.storage, filePath);
    try {
      const metadata = await getMetadata(fileRef);
      return {
        name: metadata.name,
        size: metadata.size,
        type: metadata.contentType,
        lastModified: metadata.timeCreated // Or metadata.updated for last modified time
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error; // Re-throw for proper handling
    }
  }

  // async getFile(filePath: string): Promise<string> {
  //   const fileRef = ref(this.storage, filePath);
  //   getDownloadURL(fileRef)
  //     .then((url) => {
  //       console.log(url);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  async getFile(filePath: string): Promise<string> {
    const fileRef = ref(this.storage, filePath);
    return await getDownloadURL(fileRef);
  }

  // uploadData(collectionName: string, documentId: string, data: any): Promise<void> {
  //   return this.storage.(collectionName).doc(documentId).set(data);
  // }

}
