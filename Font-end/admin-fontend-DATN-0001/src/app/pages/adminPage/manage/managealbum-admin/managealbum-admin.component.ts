import { AfterViewInit, Component, ElementRef, NO_ERRORS_SCHEMA, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { AlbumService } from '../../adminEntityService/adminService/album/album.service';
import { Singer } from '../../adminEntityService/adminEntity/singer/singer';
import { Album } from '../../adminEntityService/adminEntity/album/album';
import { FirebaseStorageCrudService } from '../../../../services/firebase-storage-crud.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { error, log } from 'console';
import { SingerService } from '../../adminEntityService/adminService/singer-service.service';
import { Observable, debounceTime, distinctUntilChanged, fromEvent, map, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SingerAlbumService } from '../../adminEntityService/adminService/singerAlbum/singer-album.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-managealbum-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule],
  templateUrl: './managealbum-admin.component.html',
  styleUrl: './managealbum-admin.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class ManagealbumAdminComponent implements OnInit, AfterViewInit, OnChanges {

  id!: number;
  albums: Album[] = [];
  album: Album = new Album();
  imageAlbum: string[] = [];
  titleAlbum: string[] = [];
  singers: Singer[] = [];
  singerName: string[] = [];
  singerTable: Singer[] = [];
  selectedSinger: Singer | null = null;
  imageUrl: string = '';
  setImageUrl: string = '';
  filterOptions!: Observable<string[]>;
  formcontrol = new FormControl('');
  selectedSingerToTable: Singer | null = null;
  imageFile: any;
  albumForm: FormGroup = this.formBuilder.group({
    title: ['', { validators: [Validators.required] }],
    description: ['', Validators.required],
    // // ... (add other form controls with their respective validators)
  });



  private _FILTER(value: string): string[] {
    const searchValue = value.toLocaleLowerCase();
    return this.singerName.filter(option => option.toLocaleLowerCase().includes(searchValue));
  }



  constructor(
    private el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private albumService: AlbumService,
    private firebaseStorage: FirebaseStorageCrudService,
    private singerService: SingerService,
    private singerAlbumService: SingerAlbumService,
    private formBuilder: FormBuilder,

  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.filterOptions = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.displaySelectedYear();
    this.displayDataOnTable();
    this.displaySingerBysearch();
    this.filterOptions = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
  }

  onSubmit() {

    if (this.albumForm.valid) {
      if (this.id) {
        this.updateAlbum(this.id);
      } else {
        this.createAlbum();
      }
    } else {
      // Handle invalid form, mark controls as touched to display validation messages
      this.markFormGroupTouched(this.albumForm);
    }

  }

  resetForm() {

    this.album.title = '';
    this.album.description = '';
    this.album.releaseYear = new Date().getFullYear();
    this.removeUpload();
    this.singerTable = [];

  }

  ngAfterViewInit(): void {
    this.filterOptions = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )

  }

  onFileSelected(event: any) {

    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 8 * 1024 * 1024; // giối hạn 25 MB

    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      this.resetFileInput(); // Hàm này để đặt lại input file sau khi thông báo lỗi
      return;
    }
    //Kiểm tra giới hạn kích thước ảnh
    if (selectedFile.size > maxSizeInBytes) {
      alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
      this.resetFileInput();
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
      this.setImageUrl = 'adminManageImage/album/' + archivoSelectcionado.name;
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

  resetFileInput(): void {
    // Đặt lại giá trị của input file
    const fileInput: any = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeUpload(): void {
    this.imageUrl = '';
    this.renderer.setProperty(this.el.nativeElement.querySelector('.file-upload-input'), 'value', '');
    this.renderer.setStyle(this.el.nativeElement.querySelector('.file-upload-content'), 'display', 'none');
    this.renderer.setStyle(this.el.nativeElement.querySelector('.image-upload-wrap'), 'display', 'block');
  }

  displaySelectedYear() {
    const yaerSelect: HTMLSelectElement | null = this.el.nativeElement.querySelector(".year");
    if (yaerSelect) {
      const currentYear: number = new Date().getFullYear();
      const startYear: number = 1979;

      for (let year: number = currentYear; year >= startYear; year--) {
        const option: HTMLOptionElement = this.renderer.createElement("option");
        this.renderer.setProperty(option, 'value', year.toString());
        this.renderer.setProperty(option, 'text', year.toString());
        this.renderer.appendChild(yaerSelect, option);
      }
    }
  }

  //Hiển thị dữ liệu lên table
  displayDataOnTable() {
    this.albumService.getAllAlbum(0, 10).subscribe(
      async (data) => {
        console.log(data);
        this.imageAlbum = data.content.map((album: Album) => album.image);
        this.titleAlbum = data.content.map((album: Album) => album.title);
        this.albums = data.content;

        for (const album of this.albums) {
          if (album.image == null || album.image == '') {
            continue;
          }
          album.image = await this.setImageURLFirebase(album.image);
          album.albumcreateDate = new Date(album.albumcreateDate);
        }

      }, (error) => {
        console.error('Error fetching data:', error);

      }
    );
  }
  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

  displaySingerBysearch() {
    this.singerService.getAllArtists().subscribe(
      async (data) => {
        this.singerName = data.map((singer: Singer) => singer.fullname);
        console.log("List singer", this.singers);
      }
    )

  }

  // //---------------Tìm kiếm singer-----------------------
  // setupSearch() {
  //   if (this.searchInput && this.searchInput.nativeElement) {
  //     const inputElement = this.searchInput.nativeElement;
  //     fromEvent(this.searchInput.nativeElement, 'input')
  //       .pipe(
  //         debounceTime(300), // Chờ 300ms sau khi người dùng nhập xong mới gọi API
  //         distinctUntilChanged(), // Chỉ gọi API nếu giá trị nhập vào thay đổi so với lần trước
  //         switchMap((event: any) => this.singerService.getAllArtistsByName(event.target.value))
  //       )
  //       .subscribe((data: Singer[]) => {
  //         this.singers = data;
  //         console.log("Singer by search: ", this.singers)
  //       }, error => {
  //         alert("Không tìm thấy ca sĩ");


  //       }

  //       );
  //   }
  // }

  addSingertoTable(singerName: string) {
    const singerExists = this.singerTable.some(singer => singer.fullname === singerName);
    if (!singerExists || this.singerTable.length === 0) {
      // Gọi API hoặc thực hiện các thao tác khác để lấy thông tin singer từ tên
      this.singerService.getAllArtistsByName(singerName).subscribe(
        (singer: Singer) => {
          // Thêm singer vào mảng singerTable
          this.singerTable.push(singer);
          // Hiển thị thông báo hoặc thực hiện các công việc khác
          console.log(`${singerName} đã được thêm vào mảng singerTable.`);
          console.log("Singer Table: ", this.singerTable);
          this.singerName = this.singerName.filter(name => name !== singerName);
          this.formcontrol.setValue('');
        },
        (error) => {
          // Xử lý lỗi khi không tìm thấy singer
          console.error(`Không tìm thấy singer có tên là ${singerName}.`);
        }
      );
    } else {
      console.log(`${singerName} đã tồn tại trong mảng singerTable.`);
    }
  }

  deleteSingerInTable(idSinger: number) {
    const index = this.singerTable.findIndex(singer => singer.id === idSinger);
    if (index !== -1) {
      const deletedSinger = this.singerTable[index];

      this.singerName.push(deletedSinger.fullname);

      this.singerTable.splice(index, 1);
      console.log("singerName: ", this.singerName)

    }
    this.filterOptions = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )


  }


  //---------------create album---------------------------
  show() {
    console.log(this.imageAlbum);
    console.log(this.titleAlbum);
    console.log("Form album: ", this.album);
    console.log("image: ", this.setImageUrl);

  }
  createAlbum() {
    const img = this.setImageUrl;
    if (img == '') {
      alert("Please.  Upload image for Album");
      return;
    }

    const duplicateIamge = this.imageAlbum.some(image => image === this.setImageUrl);
    const duplicateTitle = this.titleAlbum.some(title => title == this.album.title);
    this.album.image = this.setImageUrl;
    console.log("duplicateIamge", duplicateIamge);
    console.log("duplicateTitle", duplicateTitle);

    if (duplicateIamge && duplicateTitle) {
      alert("Duplicate image and title. Please choose a different one.");
      return;
    }
    this.albumService.createAlbum(this.album).subscribe(

      async (data: any) => {

        if (this.album.image != null) {
          await this.firebaseStorage.uploadFile('adminManageImage/album/', this.imageFile);
        }
        const albumId = data.id;
        console.log("Add album successful!");
        this.addSingerAlbums(albumId);
        this.displayDataOnTable();
        console.log("List album: ", this.albums);

      },
      (error) => console.log("Add album failed!")
    )
  }


  addSingerAlbums(albumId: number) {
    const singerIds = this.singerTable.map(singer => singer.id);

    // Lặp qua mảng singerIds và thực hiện gọi API thêm singerAlbum
    for (const singerId of singerIds) {

      console.log("singerId: ", singerId + "albumId: ", albumId);

      this.singerAlbumService.createSingerAlbum(singerId, albumId).subscribe(
        () => {
          console.log(`Added singerAlbum for singer with ID ${singerId} and album with ID ${albumId}`);
        },
        (error) => {

          console.log(error);

          console.log(`Failed to add singerAlbum for singer with ID ${singerId} and album with ID ${albumId}`);
        }
      );
    }
  }


  getAlbum(id: number) {
    this.albumService.getAlbumById(id).subscribe(
      async (data: Album) => {
        this.album = data;
        this.fillImage(await this.setImageURLFirebase(this.album.image));
      },
      (error: any) => {
        console.log(error);
      }
    )
    // this.Genree = this.router.navigate(['onesound/admin/manage/genre/', id]);
  }



  //||-------------------------------------------------------||
  //||                   Update Album                        ||
  //||-------------------------------------------------------||
  updateAlbum(id: number) {
    this.album.image = this.setImageUrl;

    this.albumService.updateAlbum(id, this.album).subscribe(
      async (data) => {
        if (this.album.image != null && this.album.image != 'null') {
          await this.firebaseStorage.uploadFile('adminManageImage/album/', this.imageFile);
        }
        this.album = new Album();
        this.removeUpload();

      },
      (error) => console.log(error)
    )
  }


  //||-------------------------------------------------------||
  //||                   Delete Album                        ||
  //||-------------------------------------------------------||
  deleteSinger(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this album? ');
    if (isConfirmed) {
      this.albumService.deleteAlbum(id).subscribe((data) => {
        console.log(data);
        this.displayDataOnTable();
      });
    }
  }


  //||-------------------------------------------------------||
  //||                   Validate Form                       ||
  //||-------------------------------------------------------||
  markFormGroupTouched(formGroup: FormGroup) {
    // Mark all controls in the form group as touched
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
