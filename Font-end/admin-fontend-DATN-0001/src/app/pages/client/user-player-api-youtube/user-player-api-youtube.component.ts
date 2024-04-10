import {CommonModule} from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Album} from '../../adminPage/adminEntityService/adminEntity/album/album';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {YouTubePlayerModule, YouTubePlayer} from '@angular/youtube-player';
import {HttpClientModule} from '@angular/common/http';
import {YoutubeApiSService} from '../../../services/youtube-api-s.service';
import {Subscription} from 'rxjs';
import {DataGlobalService} from '../../../services/data-global.service';
import {log} from 'node:console';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {FavoriteYoutbe} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import {Youtube} from '../../adminPage/adminEntityService/adminEntity/youtube-entity/youtube';
import {UserPlaylistModalComponent} from '../user-playlist-modal/user-playlist-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {
  UserPlaylistYoutubeModalComponentComponent
} from '../user-playlist-youtube-modal-component/user-playlist-youtube-modal-component.component';
import {PlaylistYoutubeService} from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import {ListeningStatsService} from '../../../services/listening-stats/listening-stats.service';
import {CommentYoutubeComponent} from '../comment-youtube/comment-youtube.component';

@Component({
  selector: 'app-user-player-api-youtube',
  standalone: true,
  imports: [YouTubePlayerModule, HttpClientModule, CommonModule],
  templateUrl: './user-player-api-youtube.component.html',
  styleUrl: './user-player-api-youtube.component.scss',
})
export class UserPlayerApiYoutubeComponent implements OnInit {
  // @Input() videoId!: string;
  videoId!: string;
  @ViewChild('player') player: YouTubePlayer | null = null;
  @ViewChild('masterPlay')
  masterPlay!: ElementRef<HTMLButtonElement>;

  @ViewChild('seek') seek!: ElementRef<HTMLInputElement>;
  @ViewChild('seek_bar') seek_bar!: ElementRef<HTMLElement>;
  @ViewChild('seek_dot') seek_dot!: ElementRef<HTMLElement>;

  @ViewChild('vol_icon') volIcon!: ElementRef<HTMLElement>;
  @ViewChild('vol') vol!: ElementRef<HTMLInputElement>;
  @ViewChild('vol_dot') volDot!: ElementRef<HTMLElement>;
  @ViewChild('vol_bar') volBar!: ElementRef<HTMLElement>;
  currentTime: string = '0:00';
  totalTime: string = '0:00';
  private updateInterval?: number;
  acc?: account | null;
  selectedVideo: any;
  favList: any[] = [];
  currentIndex!: number;
  arrPreNext: any[] = [];

  constructor(
    private youtubeService: YoutubeApiSService,
    private dataGlobal: DataGlobalService,
    private favYoutube: FavoriteService,
    private userService: accountServiceService,
    private matDialog: MatDialog,
    private PlaylistYoutubeService: PlaylistYoutubeService,
    private listeningStatsService: ListeningStatsService
  ) {
  }

  ngOnInit() {
    // this.selectedVideo = this.dataGlobal.getItem('songHeardLastTimeYoutube');
    // this.videoId = this.selectedVideo.id.videoId;

    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllYoutubeFavByUser();

    this.dataGlobal.YtGlobalId.subscribe((video) => {
      if (video == null || video == undefined) {
        this.selectedVideo = this.dataGlobal.getItem('songHeardLast');
      } else {
        this.selectedVideo = video; // Cập nhật giá trị mới của ind_display khi có sự thay đổi của index
      }
      this.videoId = this.selectedVideo.id.videoId;
    });

    this.dataGlobal.arrPreNext.subscribe((arr) => {
      this.arrPreNext = arr;
      console.log('arrPreNext from user player api', this.arrPreNext);
      this.currentIndex = this.arrPreNext.indexOf(this.selectedVideo);
      // alert(this.currentIndex);
    });

    if (!document.getElementById('youtube-api')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    this.startUpdatingSlider();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  startUpdatingSlider() {
    this.updateInterval = window.setInterval(() => {
      if (this.player) {
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        this.currentTime = this.formatDuration(currentTime);
        this.totalTime = this.formatDuration(duration);
        const value = (currentTime / duration) * 100;
        this.seek.nativeElement.value = value.toString();

        //cập nhật vị trí dấu chấm
        this.seek_dot.nativeElement.style.left = `${value}%`;

        // Cập nhật độ rộng của thanh tua nhạc
        this.seek_bar.nativeElement.style.width = `${value}%`;

        if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
          this.masterPlay.nativeElement.classList.remove('fa-play');
          this.masterPlay.nativeElement.classList.add('fa-pause');
        } else {
          this.masterPlay.nativeElement.classList.add('fa-play');
          this.masterPlay.nativeElement.classList.remove('fa-pause');
        }
      }
    }, 1000); // Cập nhật mỗi giây
  }

  formatDuration(duration: number): string {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  pauseMusic() {
    if (this.player) {
      if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
        this.player.pauseVideo();
        this.masterPlay.nativeElement.classList.add('fa-play');
        this.masterPlay.nativeElement.classList.remove('fa-pause');
      } else {
        this.player.playVideo();
        this.masterPlay.nativeElement.classList.remove('fa-play');
        this.masterPlay.nativeElement.classList.add('fa-pause');
      }
    }
  }

  handleSeekChange() {
    if (
      this.player &&
      this.player.getPlayerState() === YT.PlayerState.PLAYING
    ) {
      let seekValue = parseInt(this.seek.nativeElement.value);
      const newTime =
        (parseFloat(this.seek.nativeElement.value) / 100) *
        this.player.getDuration();
      this.player.seekTo(newTime, true);
      this.seek_dot.nativeElement.style.left = `${seekValue}%`;

      // Cập nhật độ rộng của thanh tua nhạc
      this.seek_bar.nativeElement.style.width = `${seekValue}%`;
    }
  }

  openDialog2(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: {song: songInput},
    });

    dialogRef.afterOpened().subscribe(() => {
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openDialog() {
    debugger;
    this.selectedVideo = this.dataGlobal.getItem('songHeardLast');
    console.log(this.selectedVideo);

    const Youtube: Youtube = {
      id: this.selectedVideo.id.videoId,
      title: this.selectedVideo.snippet.title,
      description: this.selectedVideo.snippet.description,
      thumbnails: this.selectedVideo.snippet.thumbnails.high.url,
      channelTitle: this.selectedVideo.snippet.channelTitle,
      publishTime: this.selectedVideo.snippet.publishTime,
    };
    console.log(Youtube);

    this.PlaylistYoutubeService.createYt(Youtube).subscribe(
      () => {
        const dialogRef = this.matDialog.open(
          UserPlaylistYoutubeModalComponentComponent,
          {
            data: {youtubeId: this.videoId},
          }
        );

        dialogRef.afterClosed().subscribe((result) => {
        });
      },
      (error) => {
        console.error('Failed to add song to the playlist:', error);
      }
    );
  }

  setVolume() {
    if (this.player) {
      const newVolume = parseFloat(this.vol.nativeElement.value);
      this.player.setVolume(newVolume);

      if (newVolume == 0) {
        this.volIcon.nativeElement.classList.remove('fa-volume-low');
        this.volIcon.nativeElement.classList.add('fa-volume-xmark');
        this.volIcon.nativeElement.classList.remove('fa-volume-high');
      } else if (newVolume > 0 && newVolume <= 50) {
        this.volIcon.nativeElement.classList.add('fa-volume-low');
        this.volIcon.nativeElement.classList.remove('fa-volume-xmark');
        this.volIcon.nativeElement.classList.remove('fa-volume-high');
      } else {
        this.volIcon.nativeElement.classList.remove('fa-volume-low');
        this.volIcon.nativeElement.classList.remove('fa-volume-xmark');
        this.volIcon.nativeElement.classList.add('fa-volume-high');
      }

      this.volBar.nativeElement.style.width = `${newVolume}%`;
      this.volDot.nativeElement.style.left = `${newVolume}%`;
    }
  }

  getAllYoutubeFavByUser() {
    if (this.acc && this.acc.id) {
      this.favYoutube.getAllFavYoutubeByUser(this.acc.id).subscribe((data) => {
        this.favList = data;

        this.checkFav();
      });
    }
  }

  checkFav() {
    let found = this.favList.find(
      (fav) => fav.youtube.id === this.selectedVideo.id.videoId
    );
    // Nếu tồn tại, gán isFav = true, ngược lại gán isFav = false
    this.selectedVideo.isFav = found ? true : false;
  }

  favorite(youtubeitem: any) {
    let youtubeId = youtubeitem.id.videoId;
    let favyt = new FavoriteYoutbe(this.acc?.id, youtubeId);
    let youtube = new Youtube(youtubeId);
    if (
      this.acc == null ||
      this.acc == undefined ||
      this.acc === null ||
      this.acc === undefined
    ) {
      alert('Please log in to use this feature');
      return;
    }
    if (youtubeitem.isFav) {
      if (!confirm('Are you sure you want to unlike?')) {
        return;
      }
      youtubeitem.isFav = false;
      this.favYoutube.deleteFavoriteYoutube(favyt).subscribe((data) => {
      });
    } else {
      youtubeitem.isFav = true;
      this.favYoutube.createYt(youtube).subscribe((data) => {
      });
      this.favYoutube.addFavoriteYoutube(favyt).subscribe((data) => {
      });
    }
  }

  previus() {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.arrPreNext.length - 1;
    }
    this.selectedVideo = this.arrPreNext[this.currentIndex];
    this.videoId = this.selectedVideo.id.videoId;
  }

  next() {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.arrPreNext.length - 1) {
      this.currentIndex = 0;
    }
    this.selectedVideo = this.arrPreNext[this.currentIndex];
    this.videoId = this.selectedVideo.id.videoId;
  }

  incrementPlayCount() {
  }

  openDialogComment() {
    const dialogRef = this.matDialog.open(CommentYoutubeComponent, {
      data: {song: this.selectedVideo},
      // selectedSong
    });
  }
}
