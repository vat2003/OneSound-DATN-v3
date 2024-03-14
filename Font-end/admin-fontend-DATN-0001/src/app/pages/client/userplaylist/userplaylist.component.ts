import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';

@Component({
  selector: 'app-userplaylist',
  templateUrl: './userplaylist.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    NgIf
  ],
  styleUrls: ['./userplaylist.component.scss']
})
export class UserplaylistComponent implements OnInit {
  Playlist: Playlist[] = [];
  account?: account | null;



  constructor(
    private playlistService: playlistService,
    private playlistSongService: PlayListSongService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: accountServiceService,

  ) { }

  ngOnInit(): void {
    this.getAllSongs();
  }

  getAllSongs(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
      (playlists: Playlist[]) => {
        this.Playlist = playlists;
        console.log(this.Playlist);
     
      },
      (error) => {                
        console.error('Error fetching songs from the playlist:', error);
      }
    );
  }

  deletePlayList(playlist: Playlist): void {    
    this.playlistSongService.removePlaylist(playlist.id ?? 0).subscribe(
      () => {      
        
        setTimeout(() => {
          window.location.reload();
        }, 500);

      },
      (error) => {
        console.error('Failed to remove song from playlist:', error);
      }
    );     
    
  }
}
