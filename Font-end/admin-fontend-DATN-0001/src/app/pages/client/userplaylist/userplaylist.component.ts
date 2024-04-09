import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Playlist} from '../../adminPage/PlaylistSong/Playlist';
import {CommonModule, NgIf} from '@angular/common';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {playlistService} from '../../adminPage/adminEntityService/adminService/playlistService.service';
import {PlayListSongService} from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import {PlaylistSong} from '../../adminPage/PlaylistSong/PlaylistSong';
import {Router} from '@angular/router';

@Component({
  selector: 'app-userplaylist',
  standalone: true,
  imports: [
    CommonModule,
    NgIf
  ],
  templateUrl: './userplaylist.component.html',
  styleUrls: ['./userplaylist.component.scss']
})
export class UserplaylistComponent implements OnInit {
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
      this.router.navigate(['onesound/home/PlayListSong', id]);
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

        this.playlists = playlists;
        this.firstPlaylistId = this.playlists[0].id;

        console.log(this.playlists);
        console.log(this.firstPlaylistId + "<0000000000000000");
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

