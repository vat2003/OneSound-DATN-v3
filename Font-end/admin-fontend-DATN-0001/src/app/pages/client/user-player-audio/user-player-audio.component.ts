import { CommonModule } from '@angular/common';
import {
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

  constructor(private dataGlobal: DataGlobalService) {}

  ngOnInit(): void {
    this.dataGlobal.YtGlobalId.subscribe((video) => {
      if (video == null || video == undefined) {
        this.selectedSong = this.dataGlobal.getItem('songHeardLast');
      } else {
        this.selectedSong = video; // Cập nhật giá trị mới của ind_display khi có sự thay đổi của index
        console.log('this.selectedSong from player AUDIO ', this.selectedSong);
      }
    });

    this.loadAudio();
    this.seek_bar.nativeElement.style.width = '0%';
    this.seek_dot.nativeElement.style.left = '0%';
  }

  loadAudio(): void {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/chayngaydi.mp3'; // đây là tao lưu cứng bài hát trong ổ, hãy dùng firebase service để lấy đường dẫn audio vào đây
    // alert(this.selectedSong)
    this.audio.addEventListener('loadedmetadata', () => {
      // Cập nhật thời lượng total của bài hát
      this.totalTime = this.formatDuration(this.audio.duration);

      // Sau khi âm thanh đã được tải, thực hiện xử lý sự kiện cho thay đổi âm lượng
      this.handleVolumeChange();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });
  }

  pauseMusic(): void {
    // let masterPlay = document.getElementById('masterPlay') as HTMLElement;

    if (this.audio.paused || this.audio.currentTime <= 0) {
      this.audio.play();
      this.masterPlay.nativeElement.classList.remove('fa-play');
      this.masterPlay.nativeElement.classList.add('fa-pause');
    } else {
      this.audio.pause();
      this.masterPlay.nativeElement.classList.add('fa-play');
      this.masterPlay.nativeElement.classList.remove('fa-pause');
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
}
