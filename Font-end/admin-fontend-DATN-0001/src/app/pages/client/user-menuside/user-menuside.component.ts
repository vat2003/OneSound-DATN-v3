import {
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {UserPlayermusicComponent} from '../user-playermusic/user-playermusic.component';
import {UserExploreComponent} from '../user-explore/user-explore.component';
import {RouterLink, RouterOutlet} from '@angular/router';
import {UserPlayerAudioComponent} from '../user-player-audio/user-player-audio.component';
import {UserPlayerApiYoutubeComponent} from '../user-player-api-youtube/user-player-api-youtube.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {DataGlobalService} from '../../../services/data-global.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {NgToastModule, NgToastService} from 'ng-angular-popup';
import {Subscription} from 'rxjs';
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {FeedbackComponent} from "../../adminPage/manage/feedback/feedback.component";

@Component({
  selector: 'app-user-menuside',
  standalone: true,
  templateUrl: './user-menuside.component.html',
  styleUrl: './user-menuside.component.scss',
  imports: [
    UserPlayermusicComponent,
    UserExploreComponent,
    RouterLink,
    RouterOutlet,
    UserPlayerAudioComponent,
    UserPlayerApiYoutubeComponent,
    FormsModule,
    CommonModule,
    NgToastModule,
  ],
})
export class UserMenusideComponent implements OnInit {
  @ViewChild('embbedPlayer') embbedPlayer!: ElementRef;
  videoId!: string;
  acc?: account | null;
  selectedVideo!: any;
  isYoutubePlayer!: boolean;

  ngOnInit(): void {
    this.acc = this.UserService.getUserResponseFromLocalStorage();
    this.dataGlobal.YtGlobalId.subscribe((video) => {
      if (video == null || video == undefined) {
        this.selectedVideo = this.dataGlobal.getItem('songHeardLast');
      } else {
        this.selectedVideo = video; // Cập nhật giá trị mới của ind_display khi có sự thay đổi của index
      }
      console.log('selectedVideo from menu-side', this.selectedVideo);
      if (this.selectedVideo.id.videoId === undefined) {
        this.isYoutubePlayer = false;
      } else {
        this.isYoutubePlayer = true;
      }
    });
    // if (!this.acc) {
    //   this.logout();
    // }
  }

  constructor(
    private router: Router,
    private dataGlobal: DataGlobalService,
    private UserService: accountServiceService,
    private toast: NgToastService,
    private matDialog: MatDialog,
  ) {
  }

  logout() {
    this.UserService.removeUserFromLocalStorage();
    this.router.navigate(['/onesound/signin']);
  }

  openD() {
    const dialogRef = this.matDialog.open(FeedbackComponent, {});
  }

  async message() {
    this.toast.warning({
      detail: 'Warning Message',
      summary: 'Please login',
      duration: 5000,
    });
  }

  gotoSearchComp(event: Event) {
    const target = event.target as HTMLInputElement;
    const keyword = target.value;
    if (keyword.trim() !== '') {
      this.router.navigate(['/onesound/home/search', keyword]);
    }
  }

  test() {
  }
}
