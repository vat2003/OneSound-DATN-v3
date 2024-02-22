import { Component, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import { Album } from '../../adminEntityService/adminEntity/album/album';
import { Singer } from '../../adminEntityService/adminEntity/singer/singer';
import { Observable, Subject, debounceTime, map, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from '../../adminEntityService/adminService/album/album.service';
import { FirebaseStorageCrudService } from '../../../../services/firebase-storage-crud.service';
import { SingerService } from '../../adminEntityService/adminService/singer-service.service';
import { SingerAlbumService } from '../../adminEntityService/adminService/singerAlbum/singer-album.service';
import { Author } from '../../adminEntityService/adminEntity/author/author';

@Component({
  selector: 'app-managesong-admin',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,],
  templateUrl: './managesong-admin.component.html',
  styleUrl: './managesong-admin.component.scss',
})
export class ManagesongAdminComponent {
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;
  p: number = 1;
  id: number = -1;
  albums: Album[] = [];
  albumName: string[] = [];
  albumTable: Album[] = [];
  singers: Singer[] = [];
  singerName: string[] = [];
  singerTable: Singer[] = [];
  selectedSinger: Singer | null = null;
  selectedAlbum: Album | null = null;
  authors: Author[] = [];
  authorName: string[] = [];
  authorTable: Author[] = [];
  selectedAuthor: Singer | null = null;
  filterOptionsSinger!: Observable<string[]>;
  filterOptionsAlbum!: Observable<string[]>;
  formcontrol = new FormControl('');
  formcontrolAlbum = new FormControl('');
  selectedSingerToTable: Singer | null = null;
  errorFieldsArr: String[] = [];
  pages: number[] = [];
  total: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  page: number = 1;
  itempage: number = 4;
  searchTerm: string = '';
  private searchTerms = new Subject<string>();
  private _FILTER(value: string): string[] {
    const searchValue = value.toLocaleLowerCase();
    return this.singerName.filter(option => option.toLocaleLowerCase().includes(searchValue));
  }
  private _FILTERAuthor(value: string): string[] {
    const searchValue = value.toLocaleLowerCase();
    return this.authorName.filter(option => option.toLocaleLowerCase().includes(searchValue));
  }
  private _FILTERAlbum(othervalue: string): string[] {
    const searchValue = othervalue.toLocaleLowerCase();
    return this.albumName.filter(option => option.toLocaleLowerCase().includes(searchValue));
  }
  constructor( private el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private albumService: AlbumService,
    private firebaseStorage: FirebaseStorageCrudService,
    private singerService: SingerService,
    private singerAlbumService: SingerAlbumService,
    private formBuilder: FormBuilder,
) {}


ngOnChanges(changes: SimpleChanges): void {
  this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
    startWith(''), map(value => this._FILTER(value || ''))
  )
  this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
    startWith(''), map(value => this._FILTERAlbum(value || ''))
  )
}

ngOnInit(): void {
  this.id = this.route.snapshot.params['id'];
  // this.displaySelectedYear();
  this.displaySingerBysearch();
  this.displayAlbumBySearch();
  this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
    startWith(''), map(value => this._FILTER(value || ''))
  )
  this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
    startWith(''), map(value => this._FILTERAlbum(value || ''))
  )
  // this.filterOptions = this.formcontrol.valueChanges.pipe(
  //   startWith(''), map(value => this._FILTERAuthor(value || ''))
  // )
  this.searchTerms
      .pipe(
        debounceTime(500), // Tăng thời gian chờ
        // Không sử dụng distinctUntilChanged tạm thời
        // distinctUntilChanged(),
        switchMap((term: string) => this.albumService.getAllAlbumByAlbumTitle(term, 0, 10))
      )
      .subscribe(async (data) => {

        // Xử lý kết quả tìm kiếm ở đây
        // Cập nhật dữ liệu trên bảng khi có kết quả tìm kiếm mới
        this.albums = data.content;
        console.log("album: --->", this.albums);
        this.total = data.totalPages;
        this.visiblePages = this.PageArray(this.page, this.total);

      });
  }

  addSingertoTable(singerName: string) {
    const singerExists = this.singerTable.some(singer => singer.fullname === singerName);
    if (!singerExists || this.singerTable.length === 0) {
      // Gọi API hoặc thực hiện các thao tác khác để lấy thông tin singer từ tên
      this.singerService.getAllArtistsByName(singerName).subscribe(
        async (singer: Singer) => {
          // Thêm singer vào mảng singerTable
          this.singerTable.push(singer);
          // Hiển thị thông báo hoặc thực hiện các công việc khác
          console.log(`${singerName} đã được thêm vào mảng singerTable.`);
          console.log("Singer Table: ", this.singerTable);
          this.singerName = this.singerName.filter(name => name !== singerName);
          this.formcontrol.setValue('');
          for (const album of this.singerTable) {
            if (album.image == null || album.image == '') {
              continue;
            }
            album.image = await this.setImageURLFirebase(album.image);

          }
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
    this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
  }
  addAlbumtoTable(albumName: string) {
    debugger
    const albumExists = this.albumTable.some(album => album.title === albumName);
    if (!albumExists || this.albumTable.length === 0) {
      debugger
      this.albumService.getAllAlbumsByName(albumName).subscribe(
        async (album: Album) => {
          debugger
          this.albumTable.push(album);
          console.log(`${albumName} đã được thêm vào bảng.`);
          console.log("Bảng album: ", this.albumTable);
          this.albumName = this.albumName.filter(name => name !== albumName);
          this.formcontrolAlbum.setValue('');
          for (const album of this.albumTable) {
            if (album.image == null || album.image == '') {
              continue;
            }
            album.image = await this.setImageURLFirebase(album.image);
          }
        },
        (error) => {
          console.error(`Không tìm thấy album có tên là ${albumName}.`);
        }
      );
    } else {
      console.log(`${albumName} đã tồn tại trong bảng.`);
    }
  }

  deleteAlbumInTable(idSinger: number) {
    const index = this.albumTable.findIndex(singer => singer.id === idSinger);
    if (index !== -1) {
      const deletedSinger = this.albumTable[index];

      this.albumName.push(deletedSinger.title);
      this.albumTable.splice(index, 1);
      console.log("Album name deleted: ", this.albumName)

    }
    this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAlbum(value || ''))
    )
  }

  // addAlbumtoTable(albumName: string) {
  //   const albumExists = this.albumTable.some(album => album.title === albumName);
  //   if (!albumExists || this.albumTable.length === 0) {
  //     this.albumService.getAllAlbumsByName(albumName).subscribe(
  //       async (album: Album) => {
  //         this.albumTable.push(album);
  //         console.log(`${albumName} đã được thêm vào bảng.`);
  //         console.log("Bảng album*************: ", this.albumTable);
  //         this.albumName = this.albumName.filter(name => name !== albumName);
  //         this.formcontrolAlbum.setValue('');
  //         for (const album of this.albumTable) {
  //           if (album.image == null || album.image == '') {
  //             continue;
  //           }
  //           album.image = await this.setImageURLFirebase(album.image);
  //         }
  //       },
  //       (error) => {
  //         console.error(`Không tìm thấy album có tên là ${albumName}.`);
  //       }
  //     );
  //   } else {
  //     console.log(`${albumName} đã tồn tại trong bảng.`);
  //   }
  // }

  // deleteAlbumInTable(id: number) {
  //   const index = this.albumTable.findIndex(album => album.id === id);
  //   if (index !== -1) {
  //     const deletedAlbum = this.albumTable[index];
  //     this.albumName.push(deletedAlbum.title);
  //     this.albumName.sort(); // Sắp xếp lại để đảm bảo thứ tự trong danh sách đề xuất
  //     this.albumTable.splice(index, 1);
  //     console.log("albumName: ", this.albumName)
  //   }
  //   this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
  //     startWith(''), map(value => this._FILTERAlbum(value || ''))
  //   )
  // }

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

  displayAlbumBySearch() {
    this.albumService.getAllAlbumNormal().subscribe(
      async (data) => {
        this.albumName = data.map((album: Album) => album.title);
        console.log("List Album", this.albumName);
      }
    );
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

  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    // this.displayDataOnTable(this.page, this.itempage);
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

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  ngAfterViewInit(): void {
    this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
    this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAlbum(value || ''))
    )
    // this.filterOptions = this.formcontrol.valueChanges.pipe(
    //   startWith(''), map(value => this._FILTERAuthor(value || ''))
    // )

  }

resetForm(){

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
