import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { YoutubeApiSService } from '../../../services/youtube-api-s.service';
import { DataGlobalService } from '../../../services/data-global.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPlaylistYoutubeModalComponentComponent } from '../user-playlist-youtube-modal-component/user-playlist-youtube-modal-component.component';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { Youtube } from '../../adminPage/adminEntityService/adminEntity/DTO/youtube';
import { PlaylistYoutubeService } from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import { PlaylistInteractionService } from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';

@Component({
  selector: 'app-user-result-search',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './user-result-search.component.html',
  styleUrl: './user-result-search.component.scss',
  providers: [YoutubeApiSService],
})
export class UserResultSearchComponent implements OnInit {
  query: string = '';
  results: any[] = [];
  // selectedVideo!: any;

  constructor(
    private route: ActivatedRoute,
    private youtubeService: YoutubeApiSService,
    private dataGlobal: DataGlobalService,
    private matDialog: MatDialog,
    private PlaylistYoutubeService: PlaylistYoutubeService,
    private playlistInteractionService: PlaylistInteractionService

  ) {}
  ngOnInit(): void {
    this.playlistInteractionService.playlistUpdated$.subscribe(() => {
      this.get_keyword_from_searchinput();
      this.search();
    });
  }


  get_keyword_from_searchinput() {
    debugger
    this.query = this.route.snapshot.params['keyword'];
  }

  search() {
    debugger
    this.youtubeService.searchVideos(this.query).subscribe(
      (response) => {
        this.results = response.items;
        console.log('thông tin kết quả');

        console.log(this.results[0]);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  showDetail(video: any) {
    debugger
    this.dataGlobal.changeId(video);
    this.dataGlobal.setItem('songHeardLast', video);
  }
  
  openDialog(videoId: string) {
    this.PlaylistYoutubeService.createYt(videoId).subscribe(
      () => {
        console.log('Song added to playlist successfully.');
        const dialogRef = this.matDialog.open(UserPlaylistYoutubeModalComponentComponent, {
          data: { youtubeId: videoId } 
        });
      },
      error => {
        console.error('Failed to add song to the playlist:', error);
      }
    );
  }


}
