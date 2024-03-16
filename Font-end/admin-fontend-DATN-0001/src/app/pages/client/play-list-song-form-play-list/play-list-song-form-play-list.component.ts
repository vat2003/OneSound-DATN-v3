import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { PlaylistSong } from '../../adminPage/PlaylistSong/PlaylistSong';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { CommonModule, NgIf } from '@angular/common';
import { PlaylistYoutubeService } from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import { catchError, forkJoin, throwError } from 'rxjs';

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
    private PlaylistYoutubeService: PlaylistYoutubeService,
    private cdr: ChangeDetectorRef,
    private userService: accountServiceService,
    private router: Router // Inject Router
    ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; 

    });
    this.timname(this.id )
    }


    timname(id: number | undefined) {
      if (id !== undefined) {
        this.playlistSongService.getAllSongsInPlaylist(id).subscribe(
          (playlistSongs) => {
            this.PlaylistSong = playlistSongs;
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

    removeSongFromPlaylist(id: number, idsong: number): void {    
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

  removeYoutubeFromPlaylist(id: number, idsong: string): void {    
      this.PlaylistYoutubeService.removeYoutubeFromPlaylist(id, idsong).subscribe(
        () => {
          this.songsInPlaylist = this.songsInPlaylist.filter(song => song.playlist?.id !== id);  
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Failed to remove song from playlist:', error);
        }
      );
   
  }
    
  
    


    // if (id !== undefined) {
    //   forkJoin([
    //     this.playlistSongService.getAllSongsInPlaylist(id),
    //     this.PlaylistYoutubeService.getListPlaylistYoutubeid(id)
    //   ]).subscribe(
    //     ([playlistSongs, youtubeSongs]) => {          
    //       this.PlaylistSong = playlistSongs
    //       this.songsInPlaylist = youtubeSongs;
    //       console.log('Songs in playlist:', this.PlaylistSong);
    //       console.log('YouTube songs in playlist:', this.songsInPlaylist);
    //     },
    //     error => {
    //       console.error('Failed to fetch songs:', error);
    //     }
    //   );
    // } else {
    //   console.error('Playlist ID is undefined.');
    // }
  




 

  // trackById(index: number, item: any): any {
  //   return item.id;
  // }
  

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.id = +params['id']; 
  //     if (this.id) {
  //       this.timname(this.id);
  //     }
  //   });
  // }
  
  // timname(id: number | undefined) {
  //   if (id) {
  //     forkJoin([
  //       this.playlistSongService.getAllSongsInPlaylist(id),
  //       this.PlaylistYoutubeService.getListPlaylistYoutubeid(id)
  //     ]).subscribe(
  //       ([playlistSongs, youtubeSongs]) => {  
  //         debugger        
  //         this.PlaylistSong = playlistSongs;
  //         this.songsInPlaylist = youtubeSongs;
  //         console.log('Songs in playlist:', this.PlaylistSong);
  //         console.log('YouTube songs in playlist:', this.songsInPlaylist);
  //       },
  //       error => {
  //         console.error('Failed to fetch songs:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Playlist ID is undefined.');
  //   }
  // }

  // removeSongFromPlaylist(id: number, idsong: number): void { 
  //   debugger   
  //   this.playlistSongService.removeSongFromPlaylist(id, idsong).subscribe(
      
  //     () => {
  //       debugger
  //       this.PlaylistSong = this.PlaylistSong.filter(song => song.playlist?.id !== id);    
  //       console.log(PlaylistSong);
  //       this.cdr.detectChanges();   
  //     },
  //     (error) => {
  //       debugger
  //       console.error('Failed to remove song from playlist:', error);
  //     }
  //   );

  // }
  
  
  // removeYoutubeFromPlaylist(id: number, idsong: string): void {    
  //   this.PlaylistYoutubeService.removeYoutubeFromPlaylist(id, idsong).subscribe(
  //     () => {
  //       this.songsInPlaylist = this.songsInPlaylist.filter(song => song.playlist?.id !== id);  
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.error('Failed to remove song from playlist:', error);
  //     }
  //   );
  //   this.cdr.detectChanges();        

  // }
  



}