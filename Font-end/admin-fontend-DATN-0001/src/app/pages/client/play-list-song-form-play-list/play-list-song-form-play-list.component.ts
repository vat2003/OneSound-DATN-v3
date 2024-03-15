import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { PlaylistSong } from '../../adminPage/PlaylistSong/PlaylistSong';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-play-list-song-form-play-list',
  standalone: true,
  imports: [
    CommonModule, 
    NgIf
  ],
  templateUrl: './play-list-song-form-play-list.component.html',
  styleUrl: './play-list-song-form-play-list.component.scss'
})
export class PlayListSongComponent implements OnInit {
  id: number | undefined;
  playlists: Playlist[] = [];
  PlaylistSong: PlaylistSong[] = [];
  account?: account | null;
  songsInPlaylist: any[] = [];
  firstPlaylistId : number | undefined;
  
  constructor(private route: ActivatedRoute,
    private playlistService: playlistService,
    private playlistSongService: PlayListSongService,
    private cdr: ChangeDetectorRef,
    private userService: accountServiceService,
    private router: Router // Inject Router
    ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // Chuyển đổi id từ string sang number nếu cần

    });
    this.timname(this.id )
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

  removeSongFromPlaylist(id: number, idsong: number): void {
    debugger

      this.playlistSongService.removeSongFromPlaylist(id, idsong).subscribe(
        () => {
          this.PlaylistSong = this.PlaylistSong.filter(song => song.playlist?.id !== id);  
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Failed to remove song from playlist:', error);
        }
      );
   
  }

  



}