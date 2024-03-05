import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserPlayermusicComponent } from '../user-playermusic/user-playermusic.component';
import { UserExploreComponent } from '../user-explore/user-explore.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserPlayerAudioComponent } from '../user-player-audio/user-player-audio.component';
import { UserPlayerApiYoutubeComponent } from '../user-player-api-youtube/user-player-api-youtube.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataGlobalService } from '../../../services/data-global.service';

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
  ],
})
export class UserMenusideComponent implements OnInit {
  @ViewChild('embbedPlayer') embbedPlayer!: ElementRef;
  isNumber: boolean = false;
  videoId!: string;
  ngOnInit(): void {}

  constructor(private router: Router, private dataGlobal: DataGlobalService) {}

  gotoSearchComp(event: Event) {
    const target = event.target as HTMLInputElement;
    const keyword = target.value;
    if (keyword.trim() !== '') {
      this.router.navigate(['/onesound/home/search', keyword]);
    }
  }
}
