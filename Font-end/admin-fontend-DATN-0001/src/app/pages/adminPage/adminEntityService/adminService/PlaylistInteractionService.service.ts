
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistInteractionService {
  private playlistUpdateSource = new Subject<void>();

  playlistUpdated$ = this.playlistUpdateSource.asObservable();

  updatePlaylist() {
    this.playlistUpdateSource.next();
  }
}
