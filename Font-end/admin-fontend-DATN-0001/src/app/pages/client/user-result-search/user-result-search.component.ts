import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {YoutubeApiSService} from '../../../services/youtube-api-s.service';
import {DataGlobalService} from '../../../services/data-global.service';
import {AdminUserServiceService} from '../../../services/admin-user-service.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {FavoriteYoutbe} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {Youtube} from '../../adminPage/adminEntityService/adminEntity/youtube-entity/youtube';
import {PlaylistYoutubeService} from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import {
  PlaylistInteractionService
} from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';
import {MatDialog} from '@angular/material/dialog';
import {
  UserPlaylistYoutubeModalComponentComponent
} from '../user-playlist-youtube-modal-component/user-playlist-youtube-modal-component.component';

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
  acc?: account | null;
  // Youtube!: Youtube;
  favList: any[] = [];

  // selectedVideo!: any;

  constructor(
    private route: ActivatedRoute,
    private youtubeService: YoutubeApiSService,
    private dataGlobal: DataGlobalService,
    private userService: accountServiceService,
    private favYoutube: FavoriteService,
    private matDialog: MatDialog,
    private PlaylistYoutubeService: PlaylistYoutubeService,
    // private playlistInteractionService: PlaylistInteractionService
  ) {
  }

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllYoutubeFavByUser();
    this.get_keyword_from_searchinput();
    this.search();
    // this.playlistInteractionService.playlistUpdated$.subscribe(() => {
    //   this.get_keyword_from_searchinput();
    //   this.search();
    // });
  }

  get_keyword_from_searchinput() {
    //debugger;
    this.query = this.route.snapshot.params['keyword'];
  }

  search() {
    //debugger;

    this.youtubeService.searchVideos(this.query).subscribe(
      (response) => {
        this.results = response.items;
        console.log(this.results[0]);
      },
      (error) => {
        console.log('Error tìm kiếmm:', error);
      }
    );
  }

  showDetail(video: any) {
    //debugger;
    this.dataGlobal.changeId(video);
    // this.dataGlobal.setSongHeardLast(video);
    this.dataGlobal.setItem('songHeardLast', video);

    this.dataGlobal.changeArr(this.results);
  }

  getAllYoutubeFavByUser() {
    if (this.acc && this.acc.id) {
      this.favYoutube.getAllFavYoutubeByUser(this.acc.id).subscribe((data) => {
        this.favList = data;
        this.checkFav();
      });
    }
  }

  favorite(youtubeitem: any) {
    let youtubeId = youtubeitem.id.videoId;
    let favyt = new FavoriteYoutbe(this.acc?.id, youtubeId);
    let youtube = new Youtube(
      youtubeitem.id.videoId,
      youtubeitem.snippet.title,
      youtubeitem.snippet.description,
      youtubeitem.snippet.thumbnails.high.url,
      youtubeitem.snippet.channelTitle,
      youtubeitem.snippet.publishTime
    );
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

  checkFav() {
    console.log(this.favList);

    for (let result of this.results) {
      let found = this.favList.find(
        (fav) => fav.youtube.id === result.id.videoId
      );
      // Nếu tồn tại, gán isFav = true, ngược lại gán isFav = false
      result.isFav = found ? true : false;
    }
  }

  openDialog(youtubeitem: any) {
    debugger;
    const Youtube: Youtube = {
      id: youtubeitem.id.videoId,
      title: youtubeitem.snippet.title,
      description: youtubeitem.snippet.description,
      thumbnails: youtubeitem.snippet.thumbnails.high.url,
      channelTitle: youtubeitem.snippet.channelTitle,
      publishTime: youtubeitem.snippet.publishTime,
    };
    this.PlaylistYoutubeService.createYt(Youtube).subscribe(
      () => {
        console.log('Song added to playlist successfully.');
        const dialogRef = this.matDialog.open(
          UserPlaylistYoutubeModalComponentComponent,
          {
            data: {youtubeId: Youtube.id},
          }
        );
      },
      (error) => {
        console.error('Failed to add song to the playlist:', error);
      }
    );
  }
}
