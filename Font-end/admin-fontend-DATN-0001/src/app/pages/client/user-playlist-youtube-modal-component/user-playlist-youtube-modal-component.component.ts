
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { FormControl, FormsModule } from '@angular/forms';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import { PlaylistYoutubeService } from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import { PlaylistYoutube } from '../../adminPage/adminEntityService/adminEntity/DTO/PlaylistYoutube';
import { PlaylistInteractionService } from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';
import { switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-playlist-youtube-modal-component',
  templateUrl: './user-playlist-youtube-modal-component.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./user-playlist-youtube-modal-component.component.scss']
})
export class UserPlaylistYoutubeModalComponentComponent implements OnInit {
  account?: account | null;
  formcontrol = new FormControl('');
  PlaylistTable: Playlist[] = [];
  songsInPlaylist: any[] = [];
  playlistName: string = '';
  playlistSongMap: { [playlistId: number]: boolean } = {};
  currentSongId: string | undefined;
  showForm = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { youtubeId: string },
    private userService: accountServiceService,
    private playlistService: playlistService,
    private playlistSongService: PlayListSongService,
    private PlaylistYoutubeService: PlaylistYoutubeService,
    private playlistInteractionService: PlaylistInteractionService,
    private cdr: ChangeDetectorRef
  ) {}

    ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    this.currentSongId = this.data.youtubeId;

    this.loadPlaylists();

  }

  loadPlaylists(): void {
    this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
      (playlists: Playlist[]) => {
        this.PlaylistTable = playlists;
        this.formcontrol.setValue('');

        playlists.forEach((playlist) => {
          this.checkSongInPlaylist(playlist);
        });
      },
      (error) => {
        console.error('Error fetching songs from the playlist:', error);
      }
    );

  }

  checkSongInPlaylist(playlist: Playlist): void {
    if (playlist.id !== undefined) {
      this.PlaylistYoutubeService.findYoutubeInPlaylist(playlist.id, this.currentSongId || '').subscribe(
        (PlaylistYoutube: PlaylistYoutube) => {
          this.playlistSongMap[playlist.id ?? 0] = PlaylistYoutube !== null;

        },
        (error) => {
          console.error(`Error fetching song in playlist ${playlist.id}:`, error);
        }
      );
    }
  }



  toggleAddRemove(playlist: Playlist): void {
    const playlistId: number = playlist.id!;
    const youtubeId: string = this.data.youtubeId;

    if (this.playlistSongMap[playlistId]) {
      this.removeSongFromPlaylist(playlistId, youtubeId);
    } else {
      this.addSongToPlaylist(playlistId, youtubeId);
    }
    this.loadPlaylists();
    this.cdr.detectChanges();

  }

  addSongToPlaylist(playlistId: number, youtubeId: string): void {
    this.PlaylistYoutubeService.addYoutubeToPlaylist(playlistId, youtubeId).pipe(
      switchMap(() => {
        this.playlistSongMap[playlistId] = true;
        this.playlistInteractionService.updatePlaylist();
        return of(null);
      })
    ).subscribe(
      () => {
        console.log('Song added to playlist successfully.');
        this.reloadComponent();
      },
      error => console.error('Failed to add song to the playlist:', error)
    );
  }

  removeSongFromPlaylist(playlistId: number, youtubeId: string): void {
    this.PlaylistYoutubeService.removeYoutubeFromPlaylist(playlistId, youtubeId).pipe(
      switchMap(() => {
        this.playlistSongMap[playlistId] = false;
        this.playlistInteractionService.updatePlaylist();
        return of(null);
      })
    ).subscribe(
      () => {
        console.log('Song removed from playlist successfully.');
        this.reloadComponent();
      },
      error => console.error('Failed to remove song from playlist:', error)
    );
  }

  timname(id: number): void {
    this.PlaylistYoutubeService.getListPlaylistYoutubeid(id).subscribe(

      (songs: any[]) => {
        this.songsInPlaylist = songs;
        console.log('Songs in playlist:', this.songsInPlaylist);
      },
      error => {
        console.error('Failed to fetch songs from the playlist:', error);
      }
    );
  }

  deletePlaylist(playlist: Playlist): void {
    this.playlistSongService.removePlaylist(playlist.id!).subscribe(
      () => console.log('Playlist removed successfully.'),
      error => console.error('Failed to remove playlist:', error)
    );
  }

  Playlist(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    const playlist: Playlist = {
      name: this.playlistName,
      user_id: {
        id: this.account?.id || 0
      }
    };

    if (!this.playlistName.trim()) {
      alert("Vui lòng không để trống tên playlist");
      return;
    }

    this.playlistService.getPlaylistByName(playlist.name).subscribe(
      (existingPlaylist: Playlist | null) => {
        if (existingPlaylist) {
          alert("Tên playlist đã tồn tại, vui lòng nhập tên playlist khác");
        } else {
          this.playlistService.createPlaylist(playlist).subscribe(
            (createdPlaylist: Playlist) => {
              this.PlaylistTable.push(createdPlaylist);
              this.playlistSongMap[createdPlaylist.id ?? 0] = true;
              console.log('Created Playlist Information:', createdPlaylist);
              this.addSongToNewPlaylist(createdPlaylist.id ?? 0);
            },
            (error) => {
              console.error('Error creating playlist:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error checking playlist name:', error);
      }
    );
  }

  addSongToNewPlaylist(playlistId: number): void {
    this.PlaylistYoutubeService.addYoutubeToPlaylist(playlistId, this.currentSongId || '').subscribe(
      () => {
        console.log('Song added to playlist successfully.');
        this.playlistSongMap[playlistId] = true;
        this.playlistInteractionService.updatePlaylist();

        // Cập nhật trạng thái của checkbox tương ứng với playlist mới
        const newPlaylistIndex = this.PlaylistTable.findIndex(playlist => playlist.id === playlistId);
        if (newPlaylistIndex !== -1) {
          this.playlistSongMap[this.PlaylistTable[newPlaylistIndex].id!] = true;
        }
      },
      (error) => {
        console.error('Failed to add song to the playlist:', error);
      }
    );
  }


  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  reloadComponent(): void {
    // window.location.reload();
  }
}

