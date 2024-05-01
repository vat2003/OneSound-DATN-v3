import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Album } from '../../adminPage/adminEntityService/adminEntity/album/album';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { DataGlobalService } from '../../../services/data-global.service';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { FavoriteService } from '../../../services/favorite-service/favorite.service';
import { FavoriteSong } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import { ListeningStatsService } from '../../../services/listening-stats/listening-stats.service';
import { HistoryListensService } from '../../../services/history-listens/history-listens.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentSongComponent } from '../comment-song/comment-song.component';
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";

@Component({
  selector: 'app-user-player-audio',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user-player-audio.component.html',
  styleUrl: './user-player-audio.component.scss',
})
export class UserPlayerAudioComponent implements OnInit {
  selectedSong: any;

  @ViewChild('masterPlay') masterPlay!: ElementRef<HTMLElement>;
  @ViewChild('seek') seek!: ElementRef<HTMLInputElement>;
  @ViewChild('seek_bar') seek_bar!: ElementRef<HTMLElement>;
  @ViewChild('seek_dot') seek_dot!: ElementRef<HTMLElement>;

  @ViewChild('vol_icon') volIcon!: ElementRef<HTMLElement>;
  @ViewChild('vol') vol!: ElementRef<HTMLInputElement>;
  @ViewChild('vol_dot') volDot!: ElementRef<HTMLElement>;
  @ViewChild('vol_bar') volBar!: ElementRef<HTMLElement>;

  audio!: HTMLAudioElement;
  currentTime: string = '0:00';
  totalTime: string = '0:00';
  songFromFirebase: any;

  acc!: account | null;
  favListSongs: any[] = [];
  prevIsYoutubePlayer!: boolean;
  playall!: boolean;
  currentIndex!: number;
  arrPreNext: any[] = [];
  private increaseLisTimeout: any;
  constructor(
    private dataGlobal: DataGlobalService,
    private firebaseStorage: FirebaseStorageCrudService,
    private userService: accountServiceService,
    private favSong: FavoriteService,
    private listenService: ListeningStatsService,
    private historyListenService: HistoryListensService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllSongFavByUser();

    this.dataGlobal.YtGlobalId.subscribe((video) => {
      if (video == null || video == undefined) {
        this.selectedSong = this.dataGlobal.getItem('songHeardLast');
      } else {
        this.audio.pause();

        // this.seek_bar.nativeElement.style.width = 0+'%';
        // this.seek_dot.nativeElement.style.left = 0+'%';
        this.selectedSong = video; // Cập nhật giá trị mới của ind_display khi có sự thay đổi của index

        console.log('this.selectedSong from player AUDIO ', this.selectedSong);
      }
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ', this.selectedSong);
      if (this.selectedSong.id.videoId === undefined) {
        this.loadAudio();
      } else {
        this.audio.pause();
      }
      this.pauseMusic();
      // this.loadAudio();
    });

    this.dataGlobal.arrPreNext.subscribe((arr) => {
      this.arrPreNext = arr;
      console.log('arrPreNext from user player api', this.arrPreNext);
      this.currentIndex = this.arrPreNext.indexOf(this.selectedSong);
      // alert(this.currentIndex);
    });

    this.dataGlobal.playall.subscribe((playall) => {
      this.playall = playall;
    });

    this.seek_bar.nativeElement.style.width = 0+'%';
    this.seek_dot.nativeElement.style.left = 0+'%';
  }

  loadAudio(): void {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/chayngaydi.mp3'; // đây là tao lưu cứng bài hát trong ổ, hãy dùng firebase service để lấy đường dẫn audio vào đây
    if (this.selectedSong) {
      // this.songFromFirebase = await this.firebaseStorage.getFile(this.selectedSong.path);
      this.audio.src = this.selectedSong.path;
      console.log('AUDIO SRC: ', this.audio.src);
      // alert(this.audio.src)
    }

    // this.audio.src = this.songFromFirebase;
    this.audio.addEventListener('loadedmetadata', () => {
      // Cập nhật thời lượng total của bài hát
      this.totalTime = this.formatDuration(this.audio.duration);

      // Sau khi âm thanh đã được tải, thực hiện xử lý sự kiện cho thay đổi âm lượng
      this.handleVolumeChange();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });
    this.audio.addEventListener('ended', () => {
      if (this.playall) {
        this.next();
      }
    });
  }

  setIncreaseLisTimeout(): void {
    // Hủy bỏ bất kỳ lên lịch tăng lượt nghe nào trước đó
    this.clearIncreaseLisTimeout();

    // Lên lịch tăng lượt nghe sau 30 giây
    this.increaseLisTimeout = setTimeout(() => {
      this.increaseLis(this.selectedSong.id);
    }, 30000); // 30000 ms = 30 giây
  }

  clearIncreaseLisTimeout(): void {
    if (this.increaseLisTimeout) {
      clearTimeout(this.increaseLisTimeout);
      this.increaseLisTimeout = null;
    }
  }

  increaseLis(songId: number) {
    this.listenService.incrementPlayCount(songId).subscribe();

  }

  pauseMusic(): void {
    // let masterPlay = document.getElementById('masterPlay') as HTMLElement;

    if (this.audio.paused || this.audio.currentTime <= 0) {
      this.audio.play();
      this.setIncreaseLisTimeout();


      this.masterPlay.nativeElement.classList.remove('fa-play');
      this.masterPlay.nativeElement.classList.add('fa-pause');
    } else {
      this.audio.pause();
      this.masterPlay.nativeElement.classList.add('fa-play');
      this.masterPlay.nativeElement.classList.remove('fa-pause');
    }
    if (this.audio.currentTime <= 1) {

      this.historyListenService.addHisLis(this.selectedSong.id, this.acc!.id).subscribe(res => {
        console.log("Add history Listen success++++++++++++++++++");
      }, error => {
        console.log("error add history: ", error);

      }
      )
    }
  }

  updateSeekBar(): void {
    // Calculate current and total duration
    let musicCurr = this.audio.currentTime;
    let musicDur = this.audio.duration;

    // Update current time display
    this.currentTime = this.formatDuration(musicCurr);

    // Update total time display
    this.totalTime = this.formatDuration(musicDur);

    // Update seek bar value
    this.seek.nativeElement.value = (musicCurr / musicDur) * 100 + '';

    // Update width of the progress bar
    this.seek_bar.nativeElement.style.width = `${this.seek.nativeElement.value}%`;

    // Update position of the dot
    this.seek_dot.nativeElement.style.left = `${this.seek.nativeElement.value}%`;

    if (this.audio.paused || this.audio.currentTime <= 0) {
      this.masterPlay.nativeElement.classList.add('fa-play');
      this.masterPlay.nativeElement.classList.remove('fa-pause');

    } else {
      this.masterPlay.nativeElement.classList.remove('fa-play');
      this.masterPlay.nativeElement.classList.add('fa-pause');

    }
  }

  formatDuration(duration: number): string {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  handleSeekChange(): void {
    // Xử lý sự kiện khi người dùng thay đổi thanh tua nhạc
    this.seek.nativeElement.addEventListener('input', () => {
      // Lấy giá trị của thanh tua nhạc
      let seekValue = parseInt(this.seek.nativeElement.value);
      // Tính toán thời gian hiện tại dựa trên giá trị tua nhạc
      let currentTime = (seekValue * this.audio.duration) / 100;

      // Cập nhật thời gian hiện tại của bài hát
      this.audio.currentTime = currentTime;

      // Cập nhật vị trí của dấu chấm
      this.seek_dot.nativeElement.style.left = `${seekValue}%`;

      // Cập nhật độ rộng của thanh tua nhạc
      this.seek_bar.nativeElement.style.width = `${seekValue}%`;
    });
  }

  // Xử lý sự kiện cho thay đổi âm lượng
  handleVolumeChange(): void {
    let vol_icon = document.getElementById('vol_icon') as HTMLElement;
    let vol = document.getElementById('vol') as HTMLInputElement;
    let vol_dot = document.getElementById('vol_dot') as HTMLElement;
    let vol_bar = document.getElementsByClassName('vol_bar')[0] as HTMLElement;

    vol.addEventListener('input', () => {
      let volValue = parseInt(vol.value);

      if (volValue == 0) {
        vol_icon.classList.remove('fa-volume-low');
        vol_icon.classList.add('fa-volume-xmark');
        vol_icon.classList.remove('fa-volume-high');
      } else if (volValue > 0 && volValue <= 50) {
        vol_icon.classList.add('fa-volume-low');
        vol_icon.classList.remove('fa-volume-xmark');
        vol_icon.classList.remove('fa-volume-high');
      } else {
        vol_icon.classList.remove('fa-volume-low');
        vol_icon.classList.remove('fa-volume-xmark');
        vol_icon.classList.add('fa-volume-high');
      }

      vol_bar.style.width = `${volValue}%`;
      vol_dot.style.left = `${volValue}%`;
      this.audio.volume = volValue / 100;
    });
  }

  getAllSongFavByUser() {
    if (this.acc && this.acc.id) {
      this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
        this.favListSongs = data;
        console.log('this.favListSongs from audio comp:', this.favListSongs);

        this.checkFav();
      });
    }
  }

  checkFav() {
    let found = this.favListSongs.find(
      (fav) => fav.song.id === this.selectedSong.id.videoId
    );

    this.selectedSong.isFav = found ? true : false;
  }

  favoriteSong(song: any) {
    // alert(song.id);
    let songId = song.id;
    let favS = new FavoriteSong(this.acc?.id, songId);
    if (
      this.acc == null ||
      this.acc == undefined ||
      this.acc === null ||
      this.acc === undefined
    ) {
      alert('Please log in to use this feature');
      return;
    }
    if (song.isFav) {
      if (!confirm('Are you sure you want to unlike?')) {
        return;
      }
      song.isFav = false;
      this.favSong.deleteFavoriteSong(favS).subscribe((data) => {});
    } else {
      song.isFav = true;
      this.favSong.addFavoriteSong(favS).subscribe((data) => {});
    }
  }

  previus() {
    this.audio.pause();
    this.currentIndex = this.currentIndex - 1;

    if (this.currentIndex < 0) {
      this.currentIndex = this.arrPreNext.length - 1;
    }
    this.selectedSong = this.arrPreNext[this.currentIndex];
    this.loadAudio();
    this.changeSong();
  }

  next() {
    this.audio.pause();
    this.currentIndex = this.currentIndex + 1;

    if (this.currentIndex > this.arrPreNext.length - 1) {
      this.currentIndex = 0;
    }

    this.selectedSong = this.arrPreNext[this.currentIndex];
    this.loadAudio();
    this.changeSong();
  }

  async changeSong() {
    this.audio.src = await this.firebaseStorage.getFile(this.selectedSong.path);
    this.pauseMusic();
  }

  openDialogComment() {
    const dialogRef = this.matDialog.open(CommentSongComponent, {
      data: { song: this.selectedSong },
      // selectedSong
    });
  }

  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: {song: songInput},
    });

    dialogRef.afterOpened().subscribe(() => {
      // this.getAllSongs();
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
// =======
// import { CommonModule } from '@angular/common';
// import {
//   ChangeDetectorRef,
//   Component,
//   ElementRef,
//   NO_ERRORS_SCHEMA,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Album } from '../../adminPage/adminEntityService/adminEntity/album/album';
// import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
// import { DataGlobalService } from '../../../services/data-global.service';
// import { HttpClientModule } from '@angular/common/http';
// import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
// import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
// import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
// import { FavoriteService } from '../../../services/favorite-service/favorite.service';
// import { FavoriteSong } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
// import { ListeningStatsService } from '../../../services/listening-stats/listening-stats.service';
// import { HistoryListensService } from '../../../services/history-listens/history-listens.service';
// import { MatDialog } from '@angular/material/dialog';
// import { CommentSongComponent } from '../comment-song/comment-song.component';
// import { UserPlaylistModalComponent } from "../user-playlist-modal/user-playlist-modal.component";
//
// @Component({
//   selector: 'app-user-player-audio',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './user-player-audio.component.html',
//   styleUrl: './user-player-audio.component.scss',
// })
// export class UserPlayerAudioComponent implements OnInit {
//   selectedSong: any;
//
//   @ViewChild('masterPlay') masterPlay!: ElementRef<HTMLElement>;
//   @ViewChild('seek') seek!: ElementRef<HTMLInputElement>;
//   @ViewChild('seek_bar') seek_bar!: ElementRef<HTMLElement>;
//   @ViewChild('seek_dot') seek_dot!: ElementRef<HTMLElement>;
//
//   @ViewChild('vol_icon') volIcon!: ElementRef<HTMLElement>;
//   @ViewChild('vol') vol!: ElementRef<HTMLInputElement>;
//   @ViewChild('vol_dot') volDot!: ElementRef<HTMLElement>;
//   @ViewChild('vol_bar') volBar!: ElementRef<HTMLElement>;
//
//   audio!: HTMLAudioElement;
//   currentTime: string = '0:00';
//   totalTime: string = '0:00';
//   songFromFirebase: any;
//
//   acc!: account | null;
//   favListSongs: any[] = [];
//   prevIsYoutubePlayer!: boolean;
//
//   currentIndex!: number;
//   arrPreNext: any[] = [];
//   private increaseLisTimeout: any;
//   constructor(
//     private dataGlobal: DataGlobalService,
//     private firebaseStorage: FirebaseStorageCrudService,
//     private userService: accountServiceService,
//     private favSong: FavoriteService,
//     private listenService: ListeningStatsService,
//     private historyListenService: HistoryListensService,
//     private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
//     private matDialog: MatDialog
//   ) { }
//
//   ngOnInit(): void {
//     this.acc = this.userService.getUserResponseFromLocalStorage();
//     this.getAllSongFavByUser();
//
//     this.dataGlobal.YtGlobalId.subscribe((video) => {
//       if (video == null || video == undefined) {
//         this.selectedSong = this.dataGlobal.getItem('songHeardLast');
//       } else {
//         this.selectedSong = video; // Cập nhật giá trị mới của ind_display khi có sự thay đổi của index
//         console.log('this.selectedSong from player AUDIO ', this.selectedSong);
//       }
//       console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ', this.selectedSong);
//       if (this.selectedSong.id.videoId === undefined) {
//         this.loadAudio();
//       } else {
//         this.audio.pause();
//       }
//
//       // this.loadAudio();
//     });
//
//     this.dataGlobal.arrPreNext.subscribe((arr) => {
//       this.arrPreNext = arr;
//       console.log('arrPreNext from user player api', this.arrPreNext);
//       this.currentIndex = this.arrPreNext.indexOf(this.selectedSong);
//       // alert(this.currentIndex);
//     });
//
//     this.seek_bar.nativeElement.style.width = '0%';
//     this.seek_dot.nativeElement.style.left = '0%';
//   }
//
//   loadAudio(): void {
//     this.audio = new Audio();
//     this.audio.src = 'assets/audio/chayngaydi.mp3'; // đây là tao lưu cứng bài hát trong ổ, hãy dùng firebase service để lấy đường dẫn audio vào đây
//     if (this.selectedSong) {
//       // this.songFromFirebase = await this.firebaseStorage.getFile(this.selectedSong.path);
//       this.audio.src = this.selectedSong.path;
//       console.log('AUDIO SRC: ', this.audio.src);
//       // alert(this.audio.src)
//     }
//
//     // this.audio.src = this.songFromFirebase;
//     this.audio.addEventListener('loadedmetadata', () => {
//       // Cập nhật thời lượng total của bài hát
//       this.totalTime = this.formatDuration(this.audio.duration);
//
//       // Sau khi âm thanh đã được tải, thực hiện xử lý sự kiện cho thay đổi âm lượng
//       this.handleVolumeChange();
//     });
//
//     this.audio.addEventListener('timeupdate', () => {
//       this.updateSeekBar();
//     });
//   }
//
//   setIncreaseLisTimeout(): void {
//     // Hủy bỏ bất kỳ lên lịch tăng lượt nghe nào trước đó
//     this.clearIncreaseLisTimeout();
//
//     // Lên lịch tăng lượt nghe sau 30 giây
//     this.increaseLisTimeout = setTimeout(() => {
//       this.increaseLis(this.selectedSong.id);
//     }, 5000); // 30000 ms = 30 giây
//   }
//
//   clearIncreaseLisTimeout(): void {
//     if (this.increaseLisTimeout) {
//       clearTimeout(this.increaseLisTimeout);
//       this.increaseLisTimeout = null;
//     }
//   }
//
//   increaseLis(songId: number) {
//     this.listenService.incrementPlayCount(songId).subscribe();
//
//   }
//
//   pauseMusic(): void {
//     // let masterPlay = document.getElementById('masterPlay') as HTMLElement;
//
//     if (this.audio.paused || this.audio.currentTime <= 0) {
//       this.audio.play();
//       this.setIncreaseLisTimeout();
//
//
//       this.masterPlay.nativeElement.classList.remove('fa-play');
//       this.masterPlay.nativeElement.classList.add('fa-pause');
//     } else {
//       this.audio.pause();
//       this.masterPlay.nativeElement.classList.add('fa-play');
//       this.masterPlay.nativeElement.classList.remove('fa-pause');
//     }
//     if (this.audio.currentTime <= 1) {
//
//       this.historyListenService.addHisLis(this.selectedSong.id, this.acc!.id).subscribe(res => {
//         console.log("Add history Listen success++++++++++++++++++");
//       }, error => {
//         console.log("error add history: ", error);
//
//       }
//       )
//     }
//   }
//
//   updateSeekBar(): void {
//     // Calculate current and total duration
//     let musicCurr = this.audio.currentTime;
//     let musicDur = this.audio.duration;
//
//     // Update current time display
//     this.currentTime = this.formatDuration(musicCurr);
//
//     // Update total time display
//     this.totalTime = this.formatDuration(musicDur);
//
//     // Update seek bar value
//     this.seek.nativeElement.value = (musicCurr / musicDur) * 100 + '';
//
//     // Update width of the progress bar
//     this.seek_bar.nativeElement.style.width = `${this.seek.nativeElement.value}%`;
//
//     // Update position of the dot
//     this.seek_dot.nativeElement.style.left = `${this.seek.nativeElement.value}%`;
//   }
//
//   formatDuration(duration: number): string {
//     let minutes = Math.floor(duration / 60);
//     let seconds = Math.floor(duration % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   }
//
//   handleSeekChange(): void {
//     // Xử lý sự kiện khi người dùng thay đổi thanh tua nhạc
//     this.seek.nativeElement.addEventListener('input', () => {
//       // Lấy giá trị của thanh tua nhạc
//       let seekValue = parseInt(this.seek.nativeElement.value);
//       // Tính toán thời gian hiện tại dựa trên giá trị tua nhạc
//       let currentTime = (seekValue * this.audio.duration) / 100;
//
//       // Cập nhật thời gian hiện tại của bài hát
//       this.audio.currentTime = currentTime;
//
//       // Cập nhật vị trí của dấu chấm
//       this.seek_dot.nativeElement.style.left = `${seekValue}%`;
//
//       // Cập nhật độ rộng của thanh tua nhạc
//       this.seek_bar.nativeElement.style.width = `${seekValue}%`;
//     });
//   }
//
//   // Xử lý sự kiện cho thay đổi âm lượng
//   handleVolumeChange(): void {
//     let vol_icon = document.getElementById('vol_icon') as HTMLElement;
//     let vol = document.getElementById('vol') as HTMLInputElement;
//     let vol_dot = document.getElementById('vol_dot') as HTMLElement;
//     let vol_bar = document.getElementsByClassName('vol_bar')[0] as HTMLElement;
//
//     vol.addEventListener('input', () => {
//       let volValue = parseInt(vol.value);
//
//       if (volValue == 0) {
//         vol_icon.classList.remove('fa-volume-low');
//         vol_icon.classList.add('fa-volume-xmark');
//         vol_icon.classList.remove('fa-volume-high');
//       } else if (volValue > 0 && volValue <= 50) {
//         vol_icon.classList.add('fa-volume-low');
//         vol_icon.classList.remove('fa-volume-xmark');
//         vol_icon.classList.remove('fa-volume-high');
//       } else {
//         vol_icon.classList.remove('fa-volume-low');
//         vol_icon.classList.remove('fa-volume-xmark');
//         vol_icon.classList.add('fa-volume-high');
//       }
//
//       vol_bar.style.width = `${volValue}%`;
//       vol_dot.style.left = `${volValue}%`;
//       this.audio.volume = volValue / 100;
//     });
//   }
//
//   getAllSongFavByUser() {
//     if (this.acc && this.acc.id) {
//       this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
//         this.favListSongs = data;
//         console.log('this.favListSongs from audio comp:', this.favListSongs);
//
//         this.checkFav();
//       });
//     }
//   }
//
//   checkFav() {
//     let found = this.favListSongs.find(
//       (fav) => fav.song.id === this.selectedSong.id.videoId
//     );
//
//     this.selectedSong.isFav = found ? true : false;
//   }
//
//   favoriteSong(song: any) {
//     // alert(song.id);
//     let songId = song.id;
//     let favS = new FavoriteSong(this.acc?.id, songId);
//     if (
//       this.acc == null ||
//       this.acc == undefined ||
//       this.acc === null ||
//       this.acc === undefined
//     ) {
//       alert('Please log in to use this feature');
//       return;
//     }
//     if (song.isFav) {
//       if (!confirm('Are you sure you want to unlike?')) {
//         return;
//       }
//       song.isFav = false;
//       this.favSong.deleteFavoriteSong(favS).subscribe((data) => { });
//     } else {
//       song.isFav = true;
//       this.favSong.addFavoriteSong(favS).subscribe((data) => { });
//     }
//   }
//
//   previus() {
//     this.currentIndex = this.currentIndex - 1;
//
//     if (this.currentIndex < 0) {
//       this.currentIndex = this.arrPreNext.length - 1;
//     }
//     this.selectedSong = this.arrPreNext[this.currentIndex];
//     this.loadAudio();
//     this.changeSong();
//   }
//
//   next() {
//     this.audio.pause();
//     this.currentIndex = this.currentIndex + 1;
//
//     if (this.currentIndex > this.arrPreNext.length - 1) {
//       this.currentIndex = 0;
//     }
//
//     this.selectedSong = this.arrPreNext[this.currentIndex];
//     this.loadAudio();
//     this.changeSong();
//   }
//
//   async changeSong() {
//     this.audio.src = await this.firebaseStorage.getFile(this.selectedSong.path);
//     this.pauseMusic();
//   }
//
//   openDialogComment() {
//     const dialogRef = this.matDialog.open(CommentSongComponent, {
//       data: { song: this.selectedSong },
//       // selectedSong
//     });
//   }
//
//   openDialog(songInput: Song) {
//     const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
//       data: { song: songInput },
//     });
//
//     dialogRef.afterOpened().subscribe(() => {
//       // this.getAllSongs();
//     });
//     dialogRef.afterClosed().subscribe((result) => {
//     });
//   }
// }
// >>>>>>> ceci1504
