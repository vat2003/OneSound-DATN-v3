import {Genre} from './../../adminEntityService/adminEntity/genre/genre';
import {SongGenreService} from './../../adminEntityService/adminService/song-genre.service';
import {SongAuthorService} from './../../adminEntityService/adminService/song-author.service';
import {SongSingerService} from './../../adminEntityService/adminService/song-singer.service';
import {AlbumService} from './../../adminEntityService/adminService/album/album.service';
import {SongService} from './../../adminEntityService/adminService/song.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Album} from '../../adminEntityService/adminEntity/album/album';
import {Singer} from '../../adminEntityService/adminEntity/singer/singer';
import {Observable, Subject, debounceTime, distinctUntilChanged, forkJoin, map, startWith, switchMap} from 'rxjs';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseStorageCrudService} from '../../../../services/firebase-storage-crud.service';
import {SingerService} from '../../adminEntityService/adminService/singer-service.service';
import {SingerAlbumService} from '../../adminEntityService/adminService/singerAlbum/singer-album.service';
import {Author} from '../../adminEntityService/adminEntity/author/author';
import {GenreServiceService} from '../../adminEntityService/adminService/genre-service.service';
import {AuthorService} from '../../adminEntityService/adminService/author.service';
import {Song} from '../../adminEntityService/adminEntity/song/song';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {SongSinger} from '../../adminEntityService/adminEntity/song/songSinger';
import {SongGenre} from '../../adminEntityService/adminEntity/song/songGenre';
import {SongAuthor} from '../../adminEntityService/adminEntity/song/songAuthor';
import {NgToastModule, NgToastService} from 'ng-angular-popup';
import {format} from 'date-fns';
import {FirebaseStorage, StorageModule} from '@angular/fire/storage';
import {getDownloadURL, ref, StorageReference} from '@firebase/storage';
import {NgxPaginationModule} from 'ngx-pagination';
import {account} from '../../adminEntityService/adminEntity/account/account';
import {accountServiceService} from '../../adminEntityService/adminService/account-service.service';

@Component({
  selector: 'app-managesong-admin',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgToastModule,
    NgxPaginationModule
  ],
  templateUrl: './managesong-admin.component.html',
  styleUrl: './managesong-admin.component.scss',
})
export class ManagesongAdminComponent implements OnInit, OnChanges {
  @ViewChild('track') track!: ElementRef;
  @ViewChild('timeslider') timeslider!: ElementRef;
  @ViewChild('player') player!: ElementRef;
  @ViewChild('fileUploadWrapper') fileUploadWrapper!: ElementRef;
  @ViewChild('start') start!: ElementRef;
  @ViewChild('reset') reset!: ElementRef;
  @ViewChild('pause') pause!: ElementRef;

  @ViewChild('durationDisplay') durationDisplay!: ElementRef;
  @ViewChild('currentTimeDisplay') currentTimeDisplay!: ElementRef;
  song: Song = new Song();
  songs!: Song[];
  songsinactive!: Song[];
  currentTime: string = '00:00';
  totalTime: string = '00:00';
  imageUrl: string = '';
  setImageUrl: string = '';
  setSongUrl: string = '';
  imageFile: any;
  imageSong: string[] = [];
  audioSong: string[] = [];
  titleSong: string[] = [];
  account?: account | null;
  audioUrl: string = '';
  setAudioUrl: string = '';
  audioFile: any;
  p: number = 1;
  pageSize: number = 10;
  id: number = -1;
  albums: Album[] = [];
  album: Album = new Album();
  albumName: string[] = [];
  albumTable: Album[] = [];
  singers: Singer[] = [];
  singerName: string[] = [];
  singerTable: Singer[] = [];
  selectedSinger: Singer | null = null;
  Genres: Genre[] = [];
  genreName: string[] = [];
  genreTable: Genre[] = [];
  selectedGenre: Genre | null = null;
  selectedAlbum: Album | null = null;
  authors: Author[] = [];
  authorName: string[] = [];
  authorTable: Author[] = [];
  selectedAuthor: Author | null = null;
  filterOptionsSinger!: Observable<string[]>;
  filterOptionsAlbum!: Observable<string[]>;
  filterOptionsGenre!: Observable<string[]>;
  filterOptionsAuthor!: Observable<string[]>;
  formcontrol = new FormControl('');
  formcontrolAlbum = new FormControl('');
  formcontrolGenre = new FormControl('');
  formcontrolAuthor = new FormControl('');
  selectedSingerToTable: Singer | null = null;
  errorFieldsArr: String[] = [];
  pages: number[] = [];
  total: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  page: number = 1;
  itempage: number = 4;
  searchTerm: string = '';
  searchTerm2: string = '';
  to: Date = new Date();
  from: Date = new Date();
  date: Date = new Date();
  forceDate: any;
  songFile: any;
  slide = false;
  songName: string = '';
  private searchTerms = new Subject<string>();
  private searchTerms2 = new Subject<string>();

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

  private _FILTERGenre(othervalue: string): string[] {
    const searchValue = othervalue.toLocaleLowerCase();
    return this.genreName.filter(option => option.toLocaleLowerCase().includes(searchValue));
  }

  constructor(private el: ElementRef,
              private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private toast: NgToastService,
              private albumService: AlbumService,
              private firebaseStorage: FirebaseStorageCrudService,
              private singerService: SingerService,
              private genreService: GenreServiceService,
              private AuthorService: AuthorService,
              private SongService: SongService,
              private SongSingerService: SongSingerService,
              private SongAuthorService: SongAuthorService,
              private SongGenreService: SongGenreService,
              private formBuilder: FormBuilder,
              private cdRef: ChangeDetectorRef,
              private accountServiceService: accountServiceService
  ) {
    const today = new Date();
    this.to = new Date(today.setDate(today.getDate() + 1));
    this.from = new Date('2015-11-05');
    // this.date = null;
  }

  search(): void {
    // this.searchTerms.next(this.searchTerm);
    const searchTermLowerCase = this.searchTerm.toLowerCase();
    // this.songs = this.songs.filter(author =>
    //   author.name.toLowerCase().includes(searchTermLowerCase) ||
    //   author.description.toLowerCase().includes(searchTermLowerCase)||
    //   author.album.title.toLowerCase().includes(searchTermLowerCase)
    // );
    this.songs = this.songs.filter((song: Song) => {
      return song.name.toLowerCase().includes(searchTermLowerCase);
    });
    if (searchTermLowerCase == '') {
      this.displayDataOnTable(0, 10);
    }
  }

  search2(): void {
    // this.searchTerms.next(this.searchTerm);
    const searchTermLowerCase = this.searchTerm2.toLowerCase();
    // this.songs = this.songs.filter(author =>
    //   author.name.toLowerCase().includes(searchTermLowerCase) ||
    //   author.description.toLowerCase().includes(searchTermLowerCase)||
    //   author.album.title.toLowerCase().includes(searchTermLowerCase)
    // );
    this.songsinactive = this.songsinactive.filter((song: Song) => {
      return song.name.toLowerCase().includes(searchTermLowerCase);
    });
    if (searchTermLowerCase == '') {
      this.displayDataOnTableInActive();
    }
  }

  onKey(event: any): void {
    this.searchTerms.next(event.target.value);
    this.searchTerms2.next(event.target.value);
  }

  toggleUpload(event: any): void {
    const value = event.target.checked;
    const sampleUrl =
      'https://upload.wikimedia.org/wikipedia/commons/f/f3/Anthem_of_Europe_%28US_Navy_instrumental_short_version%29.ogg';
    // if (value === true) {
    //   // this.track.nativeElement.src = sampleUrl;
    //   this.track.nativeElement.load();
    //   this.player.nativeElement.classList.toggle('d-block');
    //   this.fileUploadWrapper.nativeElement.classList.toggle('d-none');
    // } else {
    //   this.player.nativeElement.classList.toggle('d-block');
    //   this.fileUploadWrapper.nativeElement.classList.toggle('d-none');
    // }
    this.track.nativeElement.load();
    this.player.nativeElement.classList.toggle('d-block');
    this.fileUploadWrapper.nativeElement.classList.toggle('d-none');
    this.track.nativeElement.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });
  }

  handleFiles(event: any): void {
    const files = event.target.files;
    console.log("Files: ", files);

    if (files.length !== 1) {
      console.error("Please select only one file.");
      return;
    }

    const newSrc = URL.createObjectURL(files[0]);
    console.log("New source URL:", newSrc);

    URL.revokeObjectURL(this.track.nativeElement.src);
    this.track.nativeElement.src = newSrc;
    this.track.nativeElement.load();

    this.player.nativeElement.classList.remove('d-none');
    this.track.nativeElement.addEventListener('loadedmetadata', () => {
      this.totalTime = this.formatDuration(this.track.nativeElement.duration);
    });
    this.track.nativeElement.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });

    this.onFileSelectedAudio(event);
  }

  async handleFilesData(audioUrl: string): Promise<void> {
    try {
      // Cập nhật URL audio và hiển thị nó
      this.track.nativeElement.src = audioUrl;
      this.track.nativeElement.load();

      this.player.nativeElement.classList.remove('d-none');
      this.track.nativeElement.addEventListener('loadedmetadata', () => {
        this.totalTime = this.formatDuration(this.track.nativeElement.duration);
      });
      this.track.nativeElement.addEventListener('timeupdate', () => {
        this.updateSeekBar();
      });
    } catch (error) {
      console.error("Error fetching audio file from Firebase Storage:", error);
      // Xử lý lỗi khi không thể tải file nhạc từ Firebase Storage
    }
  }

  playTrack(): void {
    this.track.nativeElement.play();
    this.start.nativeElement.classList.toggle('d-none');
    this.pause.nativeElement.classList.toggle('d-none');
  }

  pauseTrack(): void {
    this.track.nativeElement.pause();
    this.pause.nativeElement.classList.toggle('d-none');
    this.start.nativeElement.classList.toggle('d-none');
  }

  resetTrack(): void {
    this.track.nativeElement.load();
    this.start.nativeElement.classList.toggle('d-none');
    this.pause.nativeElement.classList.toggle('d-none');
  }

  seekTrack(event: any): void {
    const currentTimeMs = event.target.value;
    this.track.nativeElement.currentTime = currentTimeMs / 1000;
  }

  sec2time(timeInSeconds: number): string {
    const pad = function (num: number, size: number): string {
      return ('000' + num).slice(size * -1);
    };

    const time = parseFloat(timeInSeconds.toFixed(3));
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time - minutes * 60);
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
  }

  updateRangeEl(rangeEl: any): void {
    const ratio = this.valueTotalRatio(rangeEl.value, rangeEl.min, rangeEl.max);
    rangeEl.style.backgroundImage = this.getLinearGradientCSS(
      ratio,
      '#3b87fd',
      '#fffcfc'
    );
  }

  valueTotalRatio(value: number, min: number, max: number): string {
    return ((value - min) / (max - min)).toFixed(2);
  }

  getLinearGradientCSS(
    ratio: string,
    leftColor: string,
    rightColor: string
  ): string {
    return [
      '-webkit-gradient(',
      'linear, ',
      'left top, ',
      'right top, ',
      'color-stop(' + ratio + ', ' + leftColor + '), ',
      'color-stop(' + ratio + ', ' + rightColor + ')',
      ')',
    ].join('');
  }

  updateSeekBar(): void {
    // Calculate current and total duration
    let musicCurr = this.track.nativeElement.currentTime;
    let musicDur = this.track.nativeElement.duration;

    // Update current time display
    this.currentTime = this.formatDuration(musicCurr);

    // Update total time display
    this.totalTime = this.formatDuration(musicDur);

    // Update seek bar value
    this.timeslider.nativeElement.value = (musicCurr / musicDur) * 100 + '';
  }

  formatDuration(duration: number): string {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  handleSeekChange(): void {
    // Xử lý sự kiện khi người dùng thay đổi thanh tua nhạc
    this.timeslider.nativeElement.addEventListener('input', () => {
      // Lấy giá trị của thanh tua nhạc
      let seekValue = parseInt(this.timeslider.nativeElement.value);
      // Tính toán thời gian hiện tại dựa trên giá trị tua nhạc
      let currentTime = (seekValue * this.track.nativeElement.duration) / 100;

      // Cập nhật thời gian hiện tại của bài hát
      this.track.nativeElement.currentTime = currentTime;
    });
  }

  OnChanges(changes: SimpleChanges): void {
    this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
    this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAlbum(value || ''))
    )

    this.filterOptionsGenre = this.formcontrolGenre.valueChanges.pipe(
      startWith(''), map(value => this._FILTERGenre(value || ''))
    )

    this.filterOptionsAuthor = this.formcontrolAuthor.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAuthor(value || ''))
    )

    this.search();
    this.search2();
  }

  filterGenre() {
    this.filterOptionsGenre = this.formcontrolGenre.valueChanges.pipe(
      startWith(''), map(value => this._FILTERGenre(value || ''))
    )
  }

  filterAuthor() {
    this.filterOptionsAuthor = this.formcontrolAuthor.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAuthor(value || ''))
    )
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.account = this.accountServiceService.getUserResponseFromLocalStorage();

    this.displaySingerBysearch();
    this.displayAlbumBySearch();
    this.displayGenreBySearch();
    this.displayAuthorBySearch();
    this.displayDataOnTable(0, 10);
    this.displayDataOnTableInActive();
    this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
    this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAlbum(value || ''))
    )
    this.filterGenre();
    this.filterAuthor();
    // this.filterOptions = this.formcontrol.valueChanges.pipe(
    //   startWith(''), map(value => this._FILTERAuthor(value || ''))
    // )

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.SongService.getAllSongsByName(term))
      )

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
    const albumExists = this.albumTable.some(album => album.title === albumName);
    if (!albumExists || this.albumTable.length === 0) {
      // Gọi API hoặc thực hiện các thao tác khác để lấy thông tin singer từ tên
      this.albumService.getAllAlbumsByName(albumName).subscribe(
        async (album: Album[]) => {
          if (this.albumTable.length >= 1) {
            this.albumName.push(this.albumTable[0].title);
            this.albumTable.splice(0, 1);
          }
          // Thêm singer vào mảng singerTable
          this.albumTable.push(album[0]);

          // Hiển thị thông báo hoặc thực hiện các công việc khác
          console.log(`${albumName} đã được thêm vào mảng singerTable.`);
          console.log("Singer Table: ", this.singerTable);


          this.albumName = this.albumName.filter(name => name !== albumName);
          this.formcontrolAlbum.setValue('');
          for (const album of this.albumTable) {
            if (album.image == null || album.image == '') {
              continue;
            }
            // album.image = await this.setImageURLFirebase(album.image);

          }
        },
        (error) => {
          // Xử lý lỗi khi không tìm thấy singer
          console.error(`Không tìm thấy singer có tên là ${albumName}.`);
        }
      );
    } else {
      console.log(`${albumName} đã tồn tại trong mảng singerTable.`);
    }
  }


  deleteAlbumInTable(idSinger: number) {
    if (this.account?.accountRole?.id == 2) {
      const index = this.albumTable.findIndex(singer => singer.id === idSinger);
      if (index !== -1) {
        const deletedSinger = this.albumTable[index];
        this.albumName.push(deletedSinger.title);
        this.albumTable.splice(index, 1);
        console.log("singerName: ", this.albumName)
      }
      this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
        startWith(''), map(value => this._FILTERAlbum(value || ''))
      )
      this.updateAlbumList();
    } else {
      alert("nhân viên không được phép xoá")

    }

  }

  addAuthortoTable(authorName: string) {
    const albumExists = this.authorTable.some(album => album.fullname === authorName);
    if (!albumExists || this.authorTable.length === 0) {
      // Gọi API hoặc thực hiện các thao tác khác để lấy thông tin singer từ tên
      this.AuthorService.getAuthorByName(authorName).subscribe(
        async (album: Author[]) => {
          // Thêm singer vào mảng singerTable
          this.authorTable.push(album[0]);

          // Hiển thị thông báo hoặc thực hiện các công việc khác
          console.log(`${authorName} đã được thêm vào mảng singerTable.`);
          console.log("Singer Table: ", this.authorTable);


          this.authorName = this.authorName.filter(name => name !== authorName);
          this.formcontrolAuthor.setValue('');
          for (const author of this.authorTable) {
            if (author.image == null || author.image == '') {
              continue;
            }
            author.image = await this.setImageURLFirebase(author.image);

          }
        },
        (error) => {
          // Xử lý lỗi khi không tìm thấy singer
          console.error(`Không tìm thấy singer có tên là ${authorName}.`);
        }
      );
    } else {
      console.log(`${authorName} đã tồn tại trong mảng singerTable.`);
    }
  }


  deleteAuthorInTable(idSinger: number) {
    const index = this.authorTable.findIndex(singer => singer.id === idSinger);
    if (index !== -1) {
      const deletedSinger = this.authorTable[index];
      this.authorName.push(deletedSinger.fullname);
      this.authorTable.splice(index, 1);
      console.log("Author Name: ", this.authorName)
    }
    this.filterOptionsAuthor = this.formcontrolAuthor.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAuthor(value || ''))
    )
    this.displayAuthorBySearch();
  }

  addGenretoTable(genreName: string) {
    const albumExists = this.genreTable.some(album => album.name === genreName);
    if (!albumExists || this.genreTable.length === 0) {
      // Gọi API hoặc thực hiện các thao tác khác để lấy thông tin singer từ tên
      this.genreService.getAllGenresByName(genreName).subscribe(
        async (album: Genre[]) => {
          // Thêm singer vào mảng singerTable
          this.genreTable.push(album[0]);

          // Hiển thị thông báo hoặc thực hiện các công việc khác
          console.log(`${genreName} đã được thêm vào mảng genreTable.`);
          console.log("Genre Table: ", this.genreTable);


          this.genreName = this.genreName.filter(name => name !== genreName);
          this.formcontrolGenre.setValue('');
          for (const genre of this.genreTable) {
            if (genre.image == null || genre.image == '') {
              continue;
            }
            genre.image = await this.setImageURLFirebase(genre.image);

          }
        },
        (error) => {
          // Xử lý lỗi khi không tìm thấy singer
          console.error(`Không tìm thấy singer có tên là ${genreName}.`);
        }
      );
    } else {
      console.log(`${genreName} đã tồn tại trong mảng singerTable.`);
    }
  }


  deleteGenreInTable(idSinger: number) {
    const index = this.genreTable.findIndex(singer => singer.id === idSinger);
    if (index !== -1) {
      const deletedSinger = this.genreTable[index];
      this.genreName.push(deletedSinger.name);
      this.genreTable.splice(index, 1);
      console.log("singerName: ", this.albumName)
    }
    this.filterOptionsGenre = this.formcontrolGenre.valueChanges.pipe(
      startWith(''), map(value => this._FILTERGenre(value || ''))
    )
    this.displayGenreBySearch();
  }


  updateAlbumList() {
    // Gọi lại hàm để lấy danh sách album mới từ service
    this.displayAlbumBySearch();
  }


  displayAlbumBySearch() {
    this.albumService.getAllAlbumNormal().subscribe(
      async (data) => {
        // Cập nhật danh sách albumName với dữ liệu mới từ service
        this.albumName = data.map((album: Album) => album.title);
        console.log("List Album", this.albumName);
      }
    );
  }

  displayGenreBySearch() {
    this.genreService.getAllGenres().subscribe(
      async (data) => {
        // Cập nhật danh sách albumName với dữ liệu mới từ service
        this.genreName = data.map((album: Genre) => album.name);
        console.log("List Genre", this.genreName);
      }
    );
  }

  displayAuthorBySearch() {
    this.AuthorService.getAllAuthors().subscribe(
      async (data) => {
        // Cập nhật danh sách albumName với dữ liệu mới từ service
        this.authorName = data.map((album: Author) => album.fullname);
        console.log("List Author", this.authorName);
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
    this.singerService.getAllArtistActive().subscribe(
      async (data) => {
        this.singerName = data.map((singer: Singer) => singer.fullname);
        console.log("List singer", this.singers);
      }
    )

  }


  onFileSelected(event: any) {
    debugger
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 8 * 1024 * 1024; // giối hạn 25 MB
    //Kiểm tra giới hạn kích thước ảnh
    // if (selectedFile.size > maxSizeInBytes) {
    //   alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
    //   this.resetFileInput();
    //   return;
    // }
    debugger
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      this.resetFileInput(); // Hàm này để đặt lại input file sau khi thông báo lỗi
      return;
    }

    //Dọc file ảnh
    debugger
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
      this.setImageUrl = 'adminManageImage/song/' + archivoSelectcionado.name;
      this.imageFile = archivoSelectcionado;
      console.log(this.imageUrl);
      reader.readAsDataURL(archivoSelectcionado);
    } else {
      this.setImageUrl = 'adminManageImage/song/null.jpg';
      this.removeUpload();
    }
  }

  restore(id: Song) {
    this.SongService.getSongById(id.id).subscribe(data => {
      data.active = true;
      this.SongService.updateSong(data.id, data).subscribe();
      this.displayDataOnTable(0, 10);
      this.reload();
    });
    // this.displayDataOnTableInActive();
  }

  inactive(id: Song) {
    this.SongService.getSongById(id.id).subscribe(data => {
      data.active = false;
      this.SongService.updateSong(data.id, data).subscribe();
      this.displayDataOnTableInActive();
      this.reload();
    })
  }

  // onFileSelectedAudio(event: any) {
  //   const selectedFile = event.target.files[0];
  //   const maxSizeInBytes = 8 * 1024 * 1024; // giối hạn 25 MB
  //   //Kiểm tra giới hạn kích thước ảnh
  //   if (selectedFile.size > maxSizeInBytes) {
  //     alert("File size axceeds the allowed limit (8 MB). Please choose a smaller file.");
  //     this.resetFileInput();
  //     return;
  //   }

  //   if (selectedFile && !selectedFile.type.startsWith('audio/')) {
  //     alert('Please select an audio file.');
  //     this.resetFileInput(); // Hàm này để đặt lại input file sau khi thông báo lỗi
  //     return;
  //   }

  //   //Đọc file audio
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const img = new Audio();
  //     img.src = e.target.result;

  //   }
  //   const archivoSelectcionado: File = event.target.files[0];
  //   console.log("FILE OBJECT ==> ", archivoSelectcionado);

  //   if (archivoSelectcionado) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.audioUrl = e.target.result;
  //       // this.fillImage(this.imageUrl);
  //     };
  //     this.setAudioUrl = 'adminManageAudio/song/' + archivoSelectcionado.name;
  //     this.imageFile = archivoSelectcionado;
  //     console.log(this.audioUrl);
  //     reader.readAsDataURL(archivoSelectcionado);
  //   } else {
  //     this.setAudioUrl = 'adminManageAudio/song/null.mp3';
  //     // this.removeUpload();
  //   }
  // }
  onFileSelectedAudio(event: any) {
    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 800 * 1024 * 1024; // 800MB in bytes
    // giới hạn 8 MB

    // Kiểm tra giới hạn kích thước tệp
    if (selectedFile.size > maxSizeInBytes) {
      alert("File size exceeds the allowed limit (800MB). Please choose a smaller file.");
      this.resetFileInput();
      return;
    }

    if (selectedFile && !selectedFile.type.startsWith('audio/')) {
      alert('Please select an audio file.');
      this.resetFileInput(); // Hàm này để đặt lại input file sau khi thông báo lỗi
      return;
    }

    // Đọc file audio
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      this.audioUrl = e.target.result;
      this.audioFile = selectedFile;

      this.setAudioUrl = 'adminManageAudio/song/' + selectedFile.name;
      console.log(this.audioUrl);
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    } else {
      this.setAudioUrl = 'adminManageAudio/song/null.mp3';
    }
  }


  resetFileInput(): void {
    // Đặt lại giá trị của input file
    const fileInput: any = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  Page(page: number) {
    this.page = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.page));
    this.displayDataOnTable(this.page, this.itempage);
  }

  PageArray(page: number, total: number): number[] {
    const maxVisiblePages = 10;
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
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  // ngAfterViewInit(): void {
  //   this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
  //     startWith(''), map(value => this._FILTER(value || ''))
  //   )
  //   this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
  //     startWith(''), map(value => this._FILTERAlbum(value || ''))
  //   )

  //   this.filterGenre();
  //   this.filterAuthor();
  //   // this.filterOptions = this.formcontrol.valueChanges.pipe(
  //   //   startWith(''), map(value => this._FILTERAuthor(value || ''))
  //   // )

  // }

  ngAfterContentInit(): void {
    // Di chuyển mã mở mat-autocomplete vào đây
    this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
      startWith(''), map(value => this._FILTER(value || ''))
    )
    this.filterOptionsAlbum = this.formcontrolAlbum.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAlbum(value || ''))
    )

    this.filterOptionsGenre = this.formcontrolGenre.valueChanges.pipe(
      startWith(''), map(value => this._FILTERGenre(value || ''))
    )

    this.filterOptionsAuthor = this.formcontrolAuthor.valueChanges.pipe(
      startWith(''), map(value => this._FILTERAuthor(value || ''))
    )

    this.search();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.filterOptions = this.formcontrol.valueChanges.pipe(
    //   startWith(''), map(value => this._FILTER(value || ''))
    // );
    this.search();
  }


  resetForm() {
    this.reload();
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

  fillAudio(url: string): void {
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.file-upload-wrapper'),
      'display',
      'none'
    );
    this.renderer.setAttribute(
      this.el.nativeElement.querySelector('.file-upload-wrapper'),
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

  removeSong(): void {
    this.audioFile = '';
    this.audioUrl = '';
    // this.renderer.setProperty(
    //   this.el.nativeElement.querySelector('.file-upload'),
    //   'value',
    //   ''
    // );
    // this.renderer.setStyle(
    //   this.el.nativeElement.querySelector('.song-upload-content'),
    //   'display',
    //   'none'
    // );
    // this.renderer.setStyle(
    //   this.el.nativeElement.querySelector('.image-upload-wrap'),
    //   'display',
    //   'block'
    // );
  }


  getSong(id: number) {
    debugger
    forkJoin({
      song: this.SongService.getSongById(id),
      singers: this.SongSingerService.getAllSingerBySong(id),
      genres: this.SongGenreService.getAllGenreBySong(id),
      authors: this.SongAuthorService.getAllAuthorBySong(id),
    }).subscribe(
      async (result: any) => {
        this.song = result.song;
        this.setImageUrl = this.song.image;
        this.song.image = await this.setImageURLFirebase(this.song.image);
        console.log("Bài hát gì đó:" + this.song)
        this.id = result.song.id;
        this.forceDate = new DatePipe('en-US').transform(this.song.release_date, 'yyyy-MM-dd');
        this.song.release_date = this.forceDate;
        if (this.albumTable.length > 0) {
          this.albumTable.forEach((data, index) => {
            this.albumTable.splice(index, 1);
          });
        }

        this.albumTable.push(this.song.album);
        this.album = this.song.album;
        this.album.image = await this.setImageURLFirebase(this.album.image);

        for (const name of this.albumName) {
          const index = this.albumName.indexOf(name);
          if (index !== -1) {
            this.albumName.splice(index, 1);
          }

        }

        this.fillImage(await this.setImageURLFirebase(this.song.image));
        // this.setSongUrl = this.song.path;
        this.setAudioUrl = this.song.path;
        //Set audio vào phía client
        this.audioUrl = await this.setImageURLFirebase(this.song.path);
        this.fillAudio(this.audioUrl);

        await this.handleFilesData(this.audioUrl);
        if (this.singerTable.length > 0) {
          this.singerTable.splice(0, this.singerTable.length);
        }
        // Process singers
        this.SongSingerService.getAllSingerBySong(id).subscribe((data) => {
          if (data && data.length > 0) {
            console.log("Dữ liệu CA SI t1: ", data);
            for (const song1 of data) {
              console.log("CA SĨ ĐÂYYYYY: " + song1.singer.id)
              this.singerService.getArtistById(song1.singer.id).subscribe(async (datasinger) => {
                if (datasinger) {
                  console.log("Dữ liệu CA SI t2: ", datasinger);

                  this.singerTable.push(datasinger);
                  console.log("Dữ liệu t3: ", this.singerTable);
                  this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
                    startWith(''),
                    map(value => this._FILTER(value || ''))
                  );
                  console.log("Singer in Table --------------------->", this.singerTable);
                  for (const singer of this.singerTable) {
                    singer.image = await this.setImageURLFirebase(singer.image);
                  }
                } else {
                  console.log("Không có dữ liệu ca sĩ");
                }
              }, error => console.log("Lỗi khi lấy ca sĩ theo AlbumId"));


            }
          } else {
            console.log("Không có dữ liệu");
          }
        });

        if (this.authorTable.length > 0) {
          this.authorTable.splice(0, this.authorTable.length);
        }
        this.SongAuthorService.getAllAuthorBySong(id).subscribe((data) => {
          if (data && data.length > 0) {
            console.log("Dữ liệu t1: ", data);
            data.forEach(song => {
              console.log("CA SĨ ĐÂYYYYY: " + song.author.id)
              this.AuthorService.getAuthorById(song.author.id).subscribe(async (datasinger) => {
                if (datasinger) {
                  console.log("Dữ liệu t2: ", datasinger);
                  this.authorTable.push(datasinger);
                  console.log("Dữ liệu t3: ", this.authorTable);
                  for (const author of this.authorTable) {
                    author.image = await this.setImageURLFirebase(author.image);
                  }

                  this.filterOptionsAuthor = this.formcontrolAuthor.valueChanges.pipe(
                    startWith(''),
                    map(value => this._FILTERAuthor(value || ''))
                  );
                  console.log("Singer in Table --------------------->", this.authorTable);
                } else {
                  console.log("Không có dữ liệu ca sĩ");
                }
              }, error => console.log("Lỗi khi lấy ca sĩ theo AlbumId"))
            });
          } else {
            console.log("Không có dữ liệu");
          }
        });
        if (this.genreTable.length > 0) {
          this.genreTable.splice(0, this.genreTable.length);
        }
        this.SongGenreService.getAllGenreBySong(id).subscribe((data) => {
          if (data && data.length > 0) {
            console.log("Dữ liệu t1: ", data);
            data.forEach(song => {
              console.log("CA SĨ ĐÂYYYYY: " + song.genre.id)
              this.genreService.getGenre(song.genre.id).subscribe(async (datasinger) => {
                if (datasinger) {
                  console.log("Dữ liệu t2: ", datasinger);
                  this.genreTable.push(datasinger);
                  console.log("Dữ liệu t3: ", this.genreTable);
                  this.filterOptionsGenre = this.formcontrolGenre.valueChanges.pipe(
                    startWith(''),
                    map(value => this._FILTERGenre(value || ''))
                  );
                  console.log("Singer in Table --------------------->", this.genreTable);
                  for (const genre of this.genreTable) {
                    genre.image = await this.setImageURLFirebase(genre.image);
                  }
                } else {
                  console.log("Không có dữ liệu ca sĩ");
                }
              }, error => console.log("Lỗi khi lấy ca sĩ theo AlbumId"))
            });
          } else {
            console.log("Không có dữ liệu");
          }
        });

        // Process genres
      }),
      (error: any) => {
        console.log(error);
      }

    console.log('aat', this.song.release_date);

  }


  async processSingers(singers: any[]) {
    try {
      const singerPromises = singers.map((element: any) => this.singerService.getArtistById(element.singerId).toPromise());
      const singerResults = await Promise.all(singerPromises);
      // Loại bỏ giá trị undefined khỏi mảng singerResults
      const filteredSingerResults = singerResults.filter(singer => singer !== undefined);
      this.singerTable = filteredSingerResults as Singer[]; // Ép kiểu sang Singer[]
      this.updateFilterOptions('singer', this.singerTable);
    } catch (error) {
      console.log("Error occurred while fetching singer data:", error);
    }
  }


  async processGenres(genres: any[]) {
    try {
      const genrePromises = genres.map((element: any) => this.genreService.getGenre(element.genreId).toPromise());
      const genreResults = await Promise.all(genrePromises);
      const filteredGenreResults = genreResults.filter(genre => genre !== undefined);
      this.genreTable = filteredGenreResults as Genre[];
      this.updateFilterOptions('genre', this.genreTable);
    } catch (error) {
      console.log("Error occurred while fetching genre data:", error);
    }
  }

  async processAuthors(authors: any[]) {
    try {
      const authorPromises = authors.map((element: any) => this.AuthorService.getAuthorById(element.authorId).toPromise());
      const authorResults = await Promise.all(authorPromises);
      const rs = authorResults.filter((author: any) => author !== undefined);
      this.authorTable = rs as Author[];
      this.updateFilterOptions('author', this.authorTable);
    } catch (error) {
      console.log("Error occurred while fetching author data:", error);
    }
  }

  async updateFilterOptions(type: string, data: any[]) {
    switch (type) {
      case 'singer':
        this.singerTable = data;
        this.filterOptionsSinger = this.formcontrol.valueChanges.pipe(
          startWith(''),
          map(value => this._FILTER(value || ''))
        );
        break;
      case 'genre':
        this.genreTable = data;
        this.filterOptionsGenre = this.formcontrolGenre.valueChanges.pipe(
          startWith(''),
          map(value => this._FILTERGenre(value || ''))
        );
        break;
      case 'author':
        this.authorTable = data;
        this.filterOptionsAuthor = this.formcontrolAuthor.valueChanges.pipe(
          startWith(''),
          map(value => this._FILTERAuthor(value || ''))
        );
        break;
      default:
        break;
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


  createSong() {
    if (this.song.release_date) {
      const today = new Date();
      const releaseDate = new Date(this.song.release_date);
      if (releaseDate.getTime() > today.getTime()) {
        this.toast.error({detail: 'Failed Message', summary: 'Invalid release date', duration: 3000});
        return;
      }
    } else {
      this.toast.error({detail: 'Failed Message', summary: 'Release date is required', duration: 3000});
      return;
    }

    // Kiểm tra xem tiêu đề bài hát có được nhập hay không
    if (!this.song.name) {
      this.toast.error({detail: 'Failed Message', summary: 'Title is required', duration: 3000});
      return;
    }
    const img = this.setImageUrl;
    const music = this.setAudioUrl;
    console.log(this.song);
    this.song.image = this.setImageUrl;
    this.song.path = this.setAudioUrl;

    // Gọi API để tạo bài hát mới
    this.album = this.albumTable[0];
    this.song.album = this.album;
    console.log("ALBUM T1: " + this.song.album);
    console.log("ALBUM T2: " + this.album);

    if (!this.setImageUrl || !this.imageFile) {
      this.song.image = 'adminManageImage/song/null.jpg';
    }
    if (!this.setAudioUrl || !this.audioFile) {
      this.song.path = 'adminManageAudio/song/null.mp3';
    }
    // Kiểm tra các trường cần thiết trước khi tạo bài hát mới
    if (!this.song.name || !this.song.release_date || !this.setImageUrl || !this.setAudioUrl) {
      alert("Vui lòng điền đầy đủ thông tin để tạo bài hát mới.");
      return; // Dừng việc thực hiện hàm nếu có trường trống
    }
    this.SongService.createSong(this.song).subscribe(async (data: any) => {
      debugger
      try {

        // Upload hình ảnh nếu có
        if (this.imageFile) {
          await this.firebaseStorage.uploadFile('adminManageImage/song/', this.imageFile);
        }

        // Upload file âm nhạc nếu có
        if (this.audioFile) {
          await this.firebaseStorage.uploadFile('adminManageAudio/song/', this.audioFile);
        }
        const songId = data.id;
        const singerIds = this.singerTable.map(singer => singer.id);
        const authorIds = this.authorTable.map(singer => singer.id);
        const genreIds = this.genreTable.map(singer => singer.id);
        this.singerTable.forEach(singerintable => {
          console.log("SINGER IN TABLE: ", singerintable); // Log singer information for debugging
          console.log("SongId: ----------------->" + songId);

          this.SongSingerService.createSongSinger(songId, singerintable.id)
            .subscribe(
              (res) => {
                console.log(`----------Added singerAlbum for singer with ID ${singerintable.id} and song with ID ${data.id}`);
              },
              (error) => {
                console.log(error);
                console.log(`----------Failed to add singerAlbum for singer with ID ${singerintable.id} and album with ID ${data.id}`);
              }
            );
        });


        this.genreTable.forEach(singerintable => {
          console.log("GENRE IN TABLE: ", singerintable); // Log singer information for debugging
          console.log("SongId: ----------------->" + songId);

          this.SongGenreService.createSongGenre(songId, singerintable.id)
            .subscribe(
              (res) => {
                console.log(`----------Added singerAlbum for GENRE with ID ${singerintable.id} and song with ID ${data.id}`);
              },
              (error) => {
                console.log(error);
                console.log(`----------Failed to add singerAlbum for GENRE with ID ${singerintable.id} and SONG with ID ${data.id}`);
              }
            );
        });


        for (const singerId of authorIds) {

          console.log("singerId: ", singerId + " albumId: ", songId);

          this.SongAuthorService.createSongAuthor(songId, singerId).subscribe(
            () => {

              console.log(`----------Added SongAuthor for singer with ID ${singerId} and album with ID ${songId}`);
            },
            (error) => {

              console.log(error);

              console.log(`----------Failed to add SongAuthor for singer with ID ${singerId} and album with ID ${songId}`);
            }
          );
        }


        // Lấy thông tin album và cập nhật vào bài hát

        // Hiển thị lại dữ liệu trên bảng và làm mới form
        this.displayDataOnTable(0, 10);
        this.resetForm();
        this.reload();
        console.log("Add song successful!");
      } catch (error) {
        console.error("Error occurred while adding song:", error);
        // alert("Failed to add song. Please try again later." + error);
        this.toast.success({detail: 'Success Message', summary: 'Adding successfully', duration: 5000});

      }
      this.toast.success({detail: 'Success Message', summary: 'Adding successfully', duration: 5000});

    }, (error) => {
      console.error("Add song failed:", error);
      // alert("Failed to add song. Please try again later.");
      this.toast.success({detail: 'Success Message', summary: 'Adding successfully', duration: 5000});

    });
  }

//   async updateSong(id: number) {
//     try {
//         console.log(this.song);

//         // Kiểm tra trùng lặp (nếu cần)
//         // ...

//         // Gọi API để cập nhật bài hát
//         await this.SongService.updateSong(id, this.song).toPromise();

//         // Upload hình ảnh nếu có
//         if (this.song.image) {
//             await this.firebaseStorage.uploadFile('adminManageImage/song/', this.imageFile);
//         }

//         // Upload file âm nhạc nếu có
//         if (this.song.path) {
//             await this.firebaseStorage.uploadFile('adminManageAudio/song/', this.audioFile);
//         }

//         // Thêm các thông tin về ca sĩ, tác giả cho bài hát
//         const albumId = id;
//         const singerIds = this.singerTable.map(singer => singer.id);
//         const authorIds = this.authorTable.map(author => author.id);
//         const genreIds = this.authorTable.map(author => author.id);

//         await Promise.all([
//             ...singerIds.map(singerId => this.SongSingerService.createSongSinger(singerId, albumId).toPromise()),
//             ...authorIds.map(authorId => this.SongAuthorService.createSongAuthor(authorId, albumId).toPromise()),
//             ...genreIds.map(genreId => this.SongGenreService.createSongGenre(genreId, albumId).toPromise()),
//         ]);

//         // Hiển thị lại dữ liệu trên bảng và làm mới form
//         this.displayDataOnTable(0, 10);
//         this.resetForm();
//         console.log("Update song successful!");
//     } catch (error) {
//         console.error("Error occurred while updating song:", error);
//         alert("Failed to update song. Please try again later." + error);
//     }
// }

  updateSong(id: number) {
    // Kiểm tra xem bài hát đã chọn để cập nhật có tồn tại không
    if (this.song.release_date) {
      const today = new Date();
      const releaseDate = new Date(this.song.release_date);
      if (releaseDate.getTime() > today.getTime()) {
        this.toast.error({detail: 'Failed Message', summary: 'Invalid release date', duration: 3000});
        return;
      }
    } else {
      this.toast.error({detail: 'Failed Message', summary: 'Release date is required', duration: 3000});
      return;
    }

    if (this.imageFile) {
      this.song.image = this.setImageUrl;
    }
    if (!this.imageFile && !this.setImageUrl || this.imageFile == '' && this.setImageUrl == '') {
      this.song.image = 'adminManageImage/song/null.jpg';
    }
    // Kiểm tra xem tiêu đề bài hát có được nhập hay không
    if (!this.song.name) {
      this.toast.error({detail: 'Failed Message', summary: 'Title is required', duration: 3000});
      return;
    }
//-----------------------------------------
    if (this.imageFile) {
      this.song.image = this.setImageUrl;
    }
    if (!this.imageFile && !this.setImageUrl || this.imageFile == '' && this.setImageUrl == '') {
      this.song.image = 'adminManageImage/song/null.jpg';
    }

    if (this.audioFile) {
      this.song.path = this.setAudioUrl;
    }
    // if (!this.setAudioUrl || !this.audioFile) {
    if ((!this.audioFile && !this.setAudioUrl) || (this.audioFile == '' && this.setAudioUrl == '')) {
      this.song.path = 'adminManageAudio/song/null.mp3';
    }

    this.album = this.albumTable[0];
    this.song.album = this.album;


    // Gọi API để cập nhật bài hát
    this.SongService.updateSong(id, this.song).subscribe(async (data: any) => {
      // try {
      console.log("Updating song...");

      // Upload hình ảnh nếu có
      if (this.imageFile) {
        await this.firebaseStorage.uploadFile('adminManageImage/song/', this.imageFile);
      }

      // Upload file âm nhạc nếu có
      if (this.audioFile) {
        await this.firebaseStorage.uploadFile('adminManageAudio/song/', this.audioFile);
      }

      // Cập nhật thông tin ca sĩ, thể loại, tác giả cho bài hát
      const songId = data.id;


      this.SongSingerService.deleteAllSongSingerBySongId(songId).subscribe((data) => {
        console.log("--------Delete all SingerAlbum successful!");

        //----------------------Thêm Singer Album-------------------------
        const singerIds = this.singerTable.map(singer => singer.id);
        console.log("---------------test--------------------------")
        for (const singerId of singerIds) {

          console.log("singerId: ", singerId + " albumId: ", id);

          for (const singerId of singerIds) {
            this.SongSingerService.createSongSinger(songId, singerId).subscribe(
              () => {
                console.log(`Updated SongSinger for singer with ID ${singerId} and song with ID ${songId}`);
              },
              (error) => {
                console.log(`Failed to update SongSinger for singer with ID ${singerId} and song with ID ${songId}`);
              }
            );
          }
        }
        // this.resetForm();
        // alert("Update successful!")
      })

      this.SongGenreService.deleteAllSongGenreBySongId(songId).subscribe((data) => {
        console.log("--------Delete all SingerAlbum successful!");

        //----------------------Thêm Singer Album-------------------------
        const genreIds = this.genreTable.map(singer => singer.id);
        console.log("---------------test--------------------------")
        for (const singerId of genreIds) {
          console.log("singerId: ", singerId + " albumId: ", id);
          this.SongGenreService.createSongGenre(songId, singerId).subscribe(
            () => {
              console.log(`Updated SongGenre for genre with ID ${singerId} and song with ID ${songId}`);
            },
            (error) => {
              console.log(`Failed to update SongGenre for genre with ID ${singerId} and song with ID ${songId}`);
            }
          );
        }

        // this.resetForm();
        // alert("Update successful!")
      })
      // Cập nhật thông tin ca sĩ


      // Cập nhật thông tin thể loại


      // Cập nhật thông tin tác giả
      // for (const authorId of authorIds) {
      //   this.SongAuthorService.createSongAuthor(songId, authorId).subscribe(
      //     () => {
      //       console.log(`Updated SongAuthor for author with ID ${authorId} and song with ID ${songId}`);
      //     },
      //     (error) => {
      //       console.log(`Failed to update SongAuthor for author with ID ${authorId} and song with ID ${songId}`);
      //     }
      //   );
      // }

      this.SongAuthorService.deleteAllSongAuthorBySongId(songId).subscribe((data) => {
        console.log("--------Delete all SingerAlbum successful!");

        //----------------------Thêm Singer Album-------------------------
        const authorIds = this.authorTable.map(singer => singer.id);
        console.log("---------------test--------------------------")
        for (const authorId of authorIds) {
          this.SongAuthorService.createSongAuthor(songId, authorId).subscribe(
            () => {
              console.log(`Updated SongAuthor for author with ID ${authorId} and song with ID ${songId}`);
            },
            (error) => {
              console.log(`Failed to update SongAuthor for author with ID ${authorId} and song with ID ${songId}`);
            }
          );
        }
        // this.resetForm();
        // alert("Update successful!")
      })

      // Hiển thị lại dữ liệu trên bảng
      this.displayDataOnTable(0, 10);
      this.displayDataOnTableInActive();
      this.reload();
      this.toast.success({detail: 'Success Message', summary: 'Update song successfully', duration: 5000});      // } catch (error) {

      // this.resetForm();
      console.log("Update song successful!");
      //   console.error("Error occurred while updating song:", error);
      //   alert("Failed to update song. Please try again later." + error);
      // }
    }, (error) => {
      console.error("Update song failed:", error);
      alert("Failed to update song. Please try again later.");
    });
    // }
    // else {
    //   alert("nhân viên không được phép update")
    //
    // }
    // Kiểm tra xem bài hát đã chọn để cập nhật có tồn tại không

  }


  displayDataOnTable(page: number, limit: number) {
    this.SongService.getAllSongsActive().subscribe(
      // this.SongService.getAllSongs().subscribe(
      async (data) => {
        console.log(data);
        this.imageSong = data.map((album: Song) => album.image);
        this.audioSong = data.map((album: Song) => album.path);
        this.titleSong = data.map((album: Song) => album.name);
        this.songs = data;
        this.song.release_date.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
        // this.song.dateTemp = formattedDate;

        // Định dạng ngày tháng cho từng bài hát
        // this.songs.forEach(album => {
        //   this.song.release = this.formatDate(album.release);
        //   console.log("Ngàyyyyyyyyyy: "+this.song.release);
        // });

        console.log("BÀI HÁT T1:" + this.songs);

        for (const song of this.songs) {
          console.log("BÀI HÁT T2:" + data);
          // KIỂM TRA SỰ TỒN TẠI CỦA IMAGE PATH
          // NẾU TỒN TẠI - CHUYỂN TỪ PATH(SQL) SANG PATH(FIREBASE) - BẰNG CÁCH GÁN MỚI CHO SONG.IMAGE
          if (song.image && song.image != '') {
            song.image = await this.setImageURLFirebase(song.image);
          }

          // KIỂM TRA SỰ TỒN TẠI CỦA SONG PATH
          // NẾU TỒN TẠI - CHUYỂN TỪ PATH(SQL) SANG PATH(FIREBASE) - BẰNG CÁCH GÁN MỚI CHO SONG.PATH
          if (song.path && song.path != '') {
            song.path = await this.setImageURLFirebase(song.path);
          }
        }

        //   // album.dateTemp=this.formatDate(album.release);
        //   // const formattedDate = album.release.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        //   // album.dateTemp = formattedDate;
        // }

        // this.total = data.totalPages;
        // this.visiblePages = this.PageArray(this.page, this.total);
      },
      (error) => {
        console.log('Error huh data:', error);
      }
    );
  }

  displayDataOnTableInActive() {
    this.SongService.getAllSongsInactive().subscribe(
      async (data) => {
        console.log(data);
        this.imageSong = data.map((album: Song) => album.image);
        this.audioSong = data.map((album: Song) => album.path);
        this.titleSong = data.map((album: Song) => album.name);
        this.songsinactive = data;
        for (let a of this.songsinactive) {
          // a.release.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
          if (a.image && a.image != '') {
            a.image = await this.setImageURLFirebase(a.image);
          }

          // KIỂM TRA SỰ TỒN TẠI CỦA SONG PATH
          // NẾU TỒN TẠI - CHUYỂN TỪ PATH(SQL) SANG PATH(FIREBASE) - BẰNG CÁCH GÁN MỚI CHO SONG.PATH
          if (a.path && a.path != '') {
            a.path = await this.setImageURLFirebase(a.path);
          }
        }

        //   // album.dateTemp=this.formatDate(album.release);
        //   // const formattedDate = album.release.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        //   // album.dateTemp = formattedDate;
        // }

        // this.total = data.totalPages;
        // this.visiblePages = this.PageArray(this.page, this.total);
      },
      (error) => {
        console.log('Error huh data:', error);
      }
    );
  }


  deleteSong(id: number) {
    if (this.account?.accountRole?.id == 2) {
      const isConfirmed = window.confirm('Are you sure you want to delete this song?');
      if (isConfirmed) {
        this.SongAuthorService.deleteAllSongAuthorBySongId(id).subscribe(data => {
        })
        this.SongGenreService.deleteAllSongGenreBySongId(id).subscribe(data => {
        })
        this.SongSingerService.deleteAllSongSingerBySongId(id).subscribe(data => {
        })
        this.SongService.deleteSong(id).subscribe(data => {
          this.displayDataOnTable(0, 10);
          this.reload();
          this.toast.warning({detail: 'Success Delete Message', summary: 'Delete successfully', duration: 3000});

        })
      }
    } else {
      alert("Staff don't allow to delete");

    }
  }
}
