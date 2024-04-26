import {SongService} from '../../adminPage/adminEntityService/adminService/song.service';
import {Singer} from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {CommonModule, NgForOf} from '@angular/common';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {FavoriteSong} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {
  PlaylistInteractionService
} from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";
import {ChangeDetectorRef, Component} from "@angular/core";
import {PlayListSongService} from "../../adminPage/adminEntityService/adminService/PlayListSongService.service";
import {PlaylistSong} from "../../adminPage/PlaylistSong/PlaylistSong";
import {playlistService} from "../../adminPage/adminEntityService/adminService/playlistService.service";
import {Playlist} from "../../adminPage/adminEntityService/adminEntity/Playlist/Playlist";
import {ActivatedRoute, Router} from "@angular/router";
import {PlaylistYoutubeService} from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import {FirebaseStorageCrudService} from "../../../services/firebase-storage-crud.service";
import {DataGlobalService} from "../../../services/data-global.service";

@Component({
  selector: 'app-user-song-in-playlist',
  standalone: true,
  imports: [NgForOf, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './user-song-in-playlist.component.html',
  styleUrl: './user-song-in-playlist.component.scss'
})
export class UserSongInPlaylistComponent {


  id: number | undefined;
  playlists: Playlist[] = [];
  PlaylistSong: PlaylistSong[] = [];
  account?: account | null;
  songsInPlaylist: any[] = [];
  firstPlaylistId: number | undefined;
  favListSongs: any[] = [];
  currentPlaylist?: Playlist;
  acc?: account | null;
  songsfromdata: PlaylistSong[] = [];
  songs: any[] = [];
  songEntity: Song | null | undefined;
  searchTerm: string = '';
  private searchTerms = new Subject<string>();


  constructor(private route: ActivatedRoute,
              private playlistService: playlistService,
              private playlistSongService: PlayListSongService,
              private PlaylistYoutubeService: PlaylistYoutubeService,
              private cdr: ChangeDetectorRef,
              private userService: accountServiceService,
              private router: Router,
              private favSong: FavoriteService, private songService: SongService,
              private firebaseStorage: FirebaseStorageCrudService,
              private playlistInteractionService: PlaylistInteractionService,
              private dataGlobal: DataGlobalService
  ) {
  }

  search(): void {
    const searchTermLowerCase = this.searchTerm.trim().toLowerCase();
    this.PlaylistSong = this.PlaylistSong.filter(PlaylistSong =>
        PlaylistSong.song?.name.toLowerCase().includes(searchTermLowerCase)
      // ||
      //playlists..toLowerCase().includes(searchTermLowerCase)
    );


    if (searchTermLowerCase == '') {
      this.timname(this.id);
    }
  }

  onKey(event: any): void {
    this.searchTerms.next(event.target.value);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];

    });
    this.timname(this.id);
    this.acc = this.userService.getUserResponseFromLocalStorage();
    // this.getAllSongs();
    this.getAllSongFavByUser();
    this.getPlaylist(this.id);
  }

  async setImageURLFirebase(image: string | any): Promise<string> {
    if (image != null) {
      try {
        const imageURL = await this.firebaseStorage.getFile(image);
        return imageURL;
      } catch (error) {
        console.error('Error getting image from Firebase Storage:', error);
        return ''; // Trả về chuỗi rỗng nếu có lỗi
      }
    } else {
      return 'null';
    }
  }


  timname(id: number | undefined) {
    if (id !== undefined) {
      this.playlistSongService.getAllSongsInPlaylist(id).subscribe(
        (playlistSongs) => {
          this.PlaylistSong = playlistSongs;
          this.fillImageSong();
          console.log('Songs in playlist:', this.PlaylistSong);
        },
        (error) => {
          console.error('Failed to fetch playlist songs:', error);
        }
      );


      this.PlaylistYoutubeService.getListPlaylistYoutubeid(id).subscribe(
        (youtubeSongs) => {
          this.songsInPlaylist = youtubeSongs;
          console.log('YouTube songs in playlist:', this.songsInPlaylist);
        },
        (error) => {
          console.error('Failed to fetch YouTube songs:', error);
        }
      );
    } else {
      console.error('Playlist ID is undefined.');
    }
  }

  fillImageSong() {
    this.PlaylistSong.forEach(song => {
      console.log(song.song?.image);
      this.setImageURLFirebase(song.song?.image).then((imageString: string) => {
        console.log('Image string:', imageString);
        this.songEntity = new Song(song.song?.name
          , imageString
          , song.song?.release_date
          , song.song?.description
          , song.song?.path
          , song.song?.lyrics
          , song.song?.album
          , song.song?.dateTemp
        );
        this.songEntity.id = <number>song.song?.id;
        song.song = this.songEntity;
      })

    });

  }

  removeSongFromPlaylist(id: number, idsong: number): void {
    this.playlistSongService.removeSongFromPlaylist(id, idsong).subscribe(
      () => {
        this.PlaylistSong = this.PlaylistSong.filter(song => song.playlist?.id !== id);
        this.timname(this.id);
        this.getPlaylist(this.id);
        // this.cdr.detectChanges();
      },
      (error) => {
        console.error('Failed to remove song from playlist:', error);
      }
    );

  }

  async showDetail(item: any) {
    item.path = await this.setImageURLFirebase(item.path);
    this.dataGlobal.changeId(item);
    this.dataGlobal.setItem('songHeardLast', item);
  }

  removeYoutubeFromPlaylist(id: number, idsong: string): void {
    this.PlaylistYoutubeService.removeYoutubeFromPlaylist(id, idsong).subscribe(
      () => {
        this.songsInPlaylist = this.songsInPlaylist.filter(song => song.playlist?.id !== id);
        this.cdr.detectChanges();
        this.timname(id);
      },
      (error) => {
        console.error('Failed to remove song from playlist:', error);
      }
    );

  }

  getPlaylist(id: any) {
    this.playlistService.getPlaylistByid(id).subscribe((data) => {
      this.currentPlaylist = data;
    });
  }

  getAllSongFavByUser() {
    if (this.acc && this.acc.id) {
      this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
        this.favListSongs = data;
        // console.log(this.favListSongs);
        this.checkFav();
      });
    }
  }

  checkFav() {
    for (let song of this.songs) {
      let found = this.favListSongs.find((fav) => fav.song.id === song.id);
      // Nếu tồn tại, gán isFav = true, ngược lại gán isFav = false
      song.isFav = found ? true : false;
    }
  }

  favoriteSong(song: any) {
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
      this.favSong.deleteFavoriteSong(favS).subscribe((data) => {
      });
    } else {
      song.isFav = true;
      this.favSong.addFavoriteSong(favS).subscribe((data) => {
      });
    }

  }
}
