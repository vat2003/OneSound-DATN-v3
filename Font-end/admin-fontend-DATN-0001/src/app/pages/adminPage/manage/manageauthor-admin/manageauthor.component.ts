import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {AuthorService} from './../../adminEntityService/adminService/author.service';
import {Author} from './../../adminEntityService/adminEntity/author/author';
import {FormControl, FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {Observable, Subject, debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs';
import {account} from '../../adminEntityService/adminEntity/account/account';
import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';

@Component({
  selector: 'app-manageauthor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink, NgToastModule, MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule],
  templateUrl: './manageauthor.component.html',
  styleUrl: './manageauthor.component.scss'
})
export class ManageauthorComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('authorForm') authorForm!: NgForm;
  id!: number;
  Author: Author = new Author();
  Authors!: Author[];
  AuthorsInactive!: Author[];
  imageUrl: string = '';
  setImageUrl: string = '';
  imageFile: any;
  errorFieldsArr: String[] = [];
  AuthorsFromData: Author[] = [];
  filterName: string = '';
  filterOptions!: Observable<string[]>;
  pages: number[] = [];
  page: number = 1;
  total: number = 0;
  itempage: number = 4;
  titleAlbum: string[] = [];
  visiblePages: number[] = [];
  localStorage?: Storage;
  formcontrol = new FormControl('');
  searchTerm: string = '';
  searchTerm2: string = '';
  filteredAuthors: any[] = [];
  singerName: string[] = [];
  account?: account | null;


  private searchTerms = new Subject<string>();
  private searchTerms2 = new Subject<string>();

  private _FILTER(value: string): string[] {
    const searchValue = value.toLocaleLowerCase();
    return this.singerName.filter(option => option.toLocaleLowerCase().includes(searchValue));
  }

  constructor(
    private AuthorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private firebaseStorage: FirebaseStorageCrudService,
    private toast: NgToastService,
    private accountServiceService: accountServiceService
  ) {
    this.filteredAuthors = this.Authors;

  }

  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    this.displayDataOnTable(this.page, this.itempage);
  }

  PageArray(page: number, total: number): number[] {
    const maxVisiblePages = 6;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(page - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, total);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }


  search(): void {
    const searchTermLowerCase = this.searchTerm.toLowerCase();

    this.Authors = this.Authors.filter(author =>
      author.fullname.toLowerCase().includes(searchTermLowerCase)
    );


    if (searchTermLowerCase == '') {
      this.displayDataOnTable(0, 5);
    }
  }

  search2(): void {
    const searchTermLowerCase = this.searchTerm2.toLowerCase();
    this.AuthorsInactive = this.AuthorsInactive.filter((author: Author) => {
      author.fullname.toLowerCase().includes(searchTermLowerCase)
    });
    if (searchTermLowerCase == '') {
      this.displayDataOnTableInActive();
    }
  }

  ngAfterViewInit(): void {
    this.filterOptions = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    );
    this.search();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.search();
    this.search2();
  }

  // onKey(event: any): void {
  //   this.search();
  // }

  onKey(event: any): void {
    this.searchTerms.next(event.target.value);
    this.searchTerms2.next(event.target.value);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.account = this.accountServiceService.getUserResponseFromLocalStorage();
    this.getAuthor(this.id);
    this.displayDataOnTable(0, 5);
    this.displayDataOnTableInActive();
  }

  displayDataOnTable(page: number, limit: number) {
    this.AuthorService.getAllAuthors().subscribe(
      async (data) => {
        console.log(data);
        this.imageFile = data.map((album: Author) => album.image);
        this.titleAlbum = data.map((album: Author) => album.fullname);
        this.Authors = data;

        for (const author of this.Authors) {
          if (author.image == '' || author.image == null) {
            continue;
          }
          author.image = await this.setImageURLFirebase(author.image);
        }

      }, (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  displayDataOnTableInActive() {
    this.AuthorService.getAllAuthorsInactive().subscribe(
      async (data) => {
        this.imageFile = data.map((album: Author) => album.image);
        this.titleAlbum = data.map((album: Author) => album.fullname);
        this.AuthorsInactive = data;

        for (const author of this.AuthorsInactive) {
          if (author.image == '' || author.image == null) {
            continue;
          }
          author.image = await this.setImageURLFirebase(author.image);
        }
      },
      (error) => {
        console.log('Error huh data:', error);
      }
    );
  }

  restore(id: Author) {
    this.AuthorService.getAuthorById(id.id).subscribe(data => {
      data.active = true;
      this.AuthorService.updateAuthor(data.id, data).subscribe();
      this.reload()
    })


  }

  inactive(id: any) {
    this.AuthorService.getAuthorById(id).subscribe((data) => {
      data.active = false;
      this.AuthorService.updateAuthor(data.id, data).subscribe();
      this.reload()
    })
    // this.displayDataOnTable(0, 5);
    // this.displayDataOnTableInActive();
    // this.reload()
    // alert("HEHHEEHHE")
  }

  deleteAuthor(id: number) {
    if (this.account?.accountRole?.id == 2) {
      const isConfirmed = window.confirm('Are you sure you want to delete this author?');
      if (isConfirmed) {
        this.AuthorService.deleteAuthor(id).subscribe(data => {
          this.loadAuthors();
          this.reload();
          this.toast.success({detail: 'Success Delete Message', summary: 'Delete successfully', duration: 3000});

        })
      }
    } else {
      // alert("Staff can't delete")
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'Only Administrator can use this Function',
        duration: 3000
      });

    }

  }

  validateAuthorEmpty(valueCheck: any): string[] {
    const errorFieldsArr: string[] = [];
    for (const key in valueCheck) {
      if (valueCheck.hasOwnProperty(key)) {
        if (!valueCheck[key]) {
          //valueCheck[key] là giá trị
          //key là tên thuộc tính
          errorFieldsArr.push(key);
        }
      }
    }
    //return nếu không lỗi
    return errorFieldsArr;
  }

  isNameExistsInArray(authorCheck: Author): boolean {
    return this.AuthorsFromData.some((author) => author.fullname === authorCheck.fullname);
  }

  filterName_Search() {
    this.Authors = this.AuthorsFromData.filter((author: Author) => {
      return author.fullname.includes(this.filterName);
    });
  }

  saveAuthor() {
    debugger
    if (this.errorFieldsArr.length || !this.Author.fullname) {
      // if (this.errorFieldsArr.length !== 0) {
      this.toast.warning({detail: 'Warning Message', summary: 'Name is null', duration: 5000});
      return;
    }
    if (this.isNameExistsInArray(this.Author)) {
      console.log('The name of the author already exists');
      this.toast.warning({detail: 'Warning Message', summary: 'Name is exists', duration: 5000});
      this.errorFieldsArr.push('existAuthorName');
      return;
    }

    //Set path ảnh được chọn từ Func onFileSelected()
    this.Author.image = this.setImageUrl;
    this.errorFieldsArr = this.validateAuthorEmpty(this.Author);

    if (!this.setImageUrl || !this.imageFile) {
      this.Author.image = 'adminManageImage/author/null.jpg';
    }


    this.AuthorService.createAuthor(this.Author).subscribe(
      async (data) => {
        if (this.imageFile) {
          await this.firebaseStorage.uploadFile('adminManageImage/author/', this.imageFile);
        }

        this.Author = new Author();
        this.removeUpload();
        this.loadAuthors();
        this.reload();
        // this.goToSingerList();
        console.log(data);
        this.toast.success({detail: 'Success Message', summary: 'Adding successfully', duration: 5000});
      },
      (error) => console.log(error)
    );
  }


  updateAuthor(id: number) {

    if (this.account?.accountRole?.id == 2) {
      if (this.imageFile) {
        this.Author.image = this.setImageUrl;
      }

      if (!this.imageFile && !this.setImageUrl) {
        this.Author.image = 'adminManageImage/author/null.jpg';
      }

      this.AuthorService.updateAuthor(id, this.Author).subscribe(
        async (data) => {
          if (this.imageFile) {
            await this.firebaseStorage.uploadFile(
              'adminManageImage/author/', this.imageFile);
          }
          this.Author = new Author();

          this.goToAuthorList();
          this.removeUpload();
          // this.reload();

          this.toast.success({detail: 'Success Message', summary: 'Update successfully', duration: 3000});
          console.log(data);
          this.reload()

        },
        (error) => {
          console.log(error);
          this.toast.error({detail: 'Error Message', summary: 'Update Falied!', duration: 3000});

        }
      );
    } else {
      // alert("nhân viên không có quyền update")
      this.toast.warning({
        detail: 'Warning Message',
        summary: 'Only Administrator can use this Function',
        duration: 3000
      });

    }


  }

  getAuthor(id: number) {
    this.AuthorService.getAuthorById(id).subscribe(
      async (data: Author) => {
        this.Author = data;
        this.setImageUrl = this.Author.image;
        this.fillImage(await this.setImageURLFirebase(this.Author.image));
      },
      (error) => console.log(error)
    );
  }

  resetForm() {
    this.Author = new Author(); // Reset form
    this.removeUpload();
    this.reload();
  }

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  loadAuthors() {
    this.AuthorService.getCategories(0, 10).subscribe(
      async (data) => {
        console.log(data);
        this.Authors = data.content;

        for (const author of this.Authors) {
          if (author.image == null || author.image == '') {
            continue;
          }
          author.image = await this.setImageURLFirebase(author.image);
        }

      }
    );
  }

  getAllAuthor() {
    this.AuthorService.getAllAuthors().subscribe(data => {
      this.Authors = data;
      console.log('Author List', this.Authors);
    })
  }

  goToAuthorList() {
    // this.getAllAuthor();
    this.loadAuthors();
    this.router.navigate(['/manage/author']);
  }

  onSubmit() {
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 8 * 1024 * 1024; // giối hạn 25 MB
    //Kiểm tra giới hạn kích thước ảnh
    if (selectedFile.size > maxSizeInBytes) {
      // alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
      this.toast.warning(
        {
          detail: 'Warning Message',
          summary: 'File size axceeds the allowed limit (8 MB). Please choose a smaller file.failed',
          duration: 3000
        });
      this.resetFileInput();
      return;
    }

    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      // alert('Please select an image file.');
      this.toast.warning({detail: 'Warning Message', summary: 'Please select an image file', duration: 3000});

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
      this.setImageUrl = 'adminManageImage/author/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = 'adminManageImage/author/null.jpg';
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

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

}
