import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UserPlaylistModalComponent} from '../user-playlist-modal/user-playlist-modal.component';
import {SongService} from '../../adminPage/adminEntityService/adminService/song.service';
import {Singer} from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {CommonModule, DatePipe, NgForOf, NgIf} from '@angular/common';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {FavoriteSong} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Playlist} from "../../adminPage/adminEntityService/adminEntity/Playlist/Playlist";
import {playlistService} from "../../adminPage/adminEntityService/adminService/playlistService.service";
import {Router, RouterLink} from "@angular/router";
import {PlaylistSong} from '../../adminPage/PlaylistSong/PlaylistSong';
import {PlayListSongService} from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import {Album} from "../../adminPage/adminEntityService/adminEntity/album/album";

@Component({
  selector: 'app-user-playlist-form',
  standalone: true,
  imports: [NgIf, NgForOf, HttpClientModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './user-playlist-form.component.html',
  styleUrl: './user-playlist-form.component.scss'
})
export class UserPlaylistFormComponent {


  playlists: Playlist[] = [];
  PlaylistSong: PlaylistSong[] = [];
  account?: account | null;
  songsInPlaylist: any[] = [];
  firstPlaylistId: number | undefined;

  constructor(
    private playlistService: playlistService,
    private playlistSongService: PlayListSongService,
    private cdr: ChangeDetectorRef,
    private userService: accountServiceService,
    private router: Router // Inject Router

  ) {
  }

  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    this.getAllPlaylists();
  }



  a(id: number | undefined) {
    if (id !== undefined) {
      // this.router.navigate(['onesound/home/PlayListSong', id]);
      this.router.navigate(['onesound/home/user/playlist/', id]);
    }
  }


  timname(id: number | undefined) {
    if (id !== undefined) {
      this.playlistSongService.getAllSongsInPlaylist(id).subscribe(
        (PlaylistSong: PlaylistSong[]) => {
          this.PlaylistSong = PlaylistSong;
          console.log('Songs in playlist:', this.PlaylistSong);
        },
        error => {

          console.error('Failed to fetch songs from the playlist:', error);
        }
      );
    } else {

      console.error('Playlist ID is undefined.');
    }
  }


  getAllPlaylists(): void {
    this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
      (playlists: Playlist[]) => {
        debugger
        this.playlists = playlists;
        this.firstPlaylistId = this.playlists[0].id;

        console.log(this.playlists);
      },
      (error) => {
        console.error('Error fetching playlists:', error);
      }
    );
  }


  deletePlaylist(playlist: Playlist): void {
    this.playlistSongService.removePlaylist(playlist.id ?? 0).subscribe(
      () => {
        this.playlists = this.playlists.filter(p => p.id !== playlist.id);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Failed to remove playlist:', error);
      }
    );
    this.getAllPlaylists();
  }

  removeSongFromPlaylist(id: number, idsong: number): void {
    if (this.firstPlaylistId !== undefined) {
      this.playlistSongService.removeSongFromPlaylist(id, idsong).subscribe(
        () => {
          this.songsInPlaylist = this.songsInPlaylist.filter(song => song.id !== id);

          this.PlaylistSong = this.PlaylistSong.filter(p => p.playlistId !== this.firstPlaylistId || p.songId !== id);

          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Failed to remove song from playlist:', error);
        }
      );
    } else {
      console.error('First playlist ID is undefined.');
    }
  }

}
