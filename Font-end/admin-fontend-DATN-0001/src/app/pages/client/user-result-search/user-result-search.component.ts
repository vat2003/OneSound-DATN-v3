import { AlbumService } from './../../adminPage/adminEntityService/adminService/album/album.service';
import { AuthorService } from './../../adminPage/adminEntityService/adminService/author.service';
import { GenreServiceService } from './../../adminPage/adminEntityService/adminService/genre-service.service';
import { SingerService } from './../../adminPage/adminEntityService/adminService/singer-service.service';
import { SongSingerService } from './../../adminPage/adminEntityService/adminService/song-singer.service';
import { SongService } from './../../adminPage/adminEntityService/adminService/song.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { YoutubeApiSService } from '../../../services/youtube-api-s.service';
import { DataGlobalService } from '../../../services/data-global.service';
import { AdminUserServiceService } from '../../../services/admin-user-service.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { FavoriteYoutbe } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import { FavoriteService } from '../../../services/favorite-service/favorite.service';
import { Youtube } from '../../adminPage/adminEntityService/adminEntity/youtube-entity/youtube';
import { PlaylistYoutubeService } from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import { PlaylistInteractionService } from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPlaylistYoutubeModalComponentComponent } from '../user-playlist-youtube-modal-component/user-playlist-youtube-modal-component.component';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { forkJoin, map, switchMap } from 'rxjs';
import { Author } from '../../adminPage/adminEntityService/adminEntity/author/author';
import { Genre } from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import { Album } from '../../adminPage/adminEntityService/adminEntity/album/album';


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
  songs: Song[]=[];
  singerforsearch: Singer[]=[];
  authors:Author[]=[];
  genres:Genre[]=[];
  singerMap: { [key: number]: any[] } = {};
  singers:Singer[]=[];
  albums:Album[]=[]
  // selectedVideo!: any;

  constructor(
    private route: ActivatedRoute,
    private youtubeService: YoutubeApiSService,
    private dataGlobal: DataGlobalService,
    private userService: accountServiceService,
    private favYoutube: FavoriteService,
    private matDialog: MatDialog,
    private PlaylistYoutubeService: PlaylistYoutubeService,
    private playlistInteractionService: PlaylistInteractionService,
    private SongService:SongService,
    private SongSingerService:SongSingerService,
    private SingerService:SingerService,
    private GenreServiceService:GenreServiceService,
    private AuthorService:AuthorService,
    private router: Router,
    private AlbumService:AlbumService
  ) {}

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllYoutubeFavByUser();
    this.get_keyword_from_searchinput();
    this.search();
    this.playlistInteractionService.playlistUpdated$.subscribe(() => {
      this.get_keyword_from_searchinput();
      this.search();
      // this.reload();
    });
  }

  get_keyword_from_searchinput() {
    //debugger;
    this.query = this.route.snapshot.params['keyword'];
    // this.reload(this.query);
  }

  @HostListener('window:keyup.enter', ['$event'])
  onEnterKeyPress(event: KeyboardEvent) {
    window.location.reload();
  }

  search() {
    console.log("Từ khóa: ",this.query)
    debugger;
    this.SongService.getAllSongs().subscribe(data => {
      // Lọc dữ liệu sau khi nhận được danh sách toàn bộ bài hát
      this.songs = data.filter((song: Song) => {
        return song.name.toLowerCase().includes(this.query);
      });
    });

    this.SingerService.getAllArtists().subscribe(data => {
      // Lọc dữ liệu sau khi nhận được danh sách toàn bộ bài hát
      this.singerforsearch = data.filter((song: Singer) => {
        return song.fullname.toLowerCase().includes(this.query);
      });
    });

    this.AlbumService.getAllAlbumNormal().subscribe(data => {
      // Lọc dữ liệu sau khi nhận được danh sách toàn bộ bài hát
      this.albums = data.filter((song: Album) => {
        return song.title.toLowerCase().includes(this.query);
      });
    });

    this.GenreServiceService.getAllGenres().subscribe(data => {
      // Lọc dữ liệu sau khi nhận được danh sách toàn bộ bài hát
      this.genres = data.filter((song: Genre) => {
        return song.name.toLowerCase().includes(this.query);
      });
    });

    this.getSingersForSongs();
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

  getSingersForSongs() {
    const observables = this.songs.map(song => {
      return this.SongSingerService.getAllSingerBySong(song.id).pipe(
        switchMap(singers => {
          const singerObservables = singers.map(singer => this.SingerService.getArtistById(singer.singer.id));
          return forkJoin(singerObservables).pipe(
            map(singerDataArray => {
              return { songId: song.id, singers: singerDataArray };
            })
          );
        })
      );
    });

    forkJoin(observables).subscribe(results => {
      results.forEach(result => {
        this.singerMap[result.songId] = result.singers;
      });
      console.log("Singer Map:", this.singerMap);
    });
  }

  showDetail(video: any) {
    //debugger;
    this.dataGlobal.changeId(video);
    // this.dataGlobal.setSongHeardLast(video);
    this.dataGlobal.setItem('songHeardLast', video);

    this.dataGlobal.changeArr(this.results);
  }

  gotoDetailArtist(artist: Singer): void {
    this.router.navigate(['/onesound/home/profile/', artist.id]);
  }

  gotoDetailAlbum(album: Album): void {
    this.router.navigate(['/onesound/home/album/', album.id]);
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
