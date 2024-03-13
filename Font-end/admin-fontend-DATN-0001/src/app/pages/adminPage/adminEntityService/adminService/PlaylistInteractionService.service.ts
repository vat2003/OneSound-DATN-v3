
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistInteractionService {
  private playlistUpdateSource = new Subject<void>();
  playlistUpdatedd$: EventEmitter<void> = new EventEmitter<void>();

  playlistUpdated$ = this.playlistUpdateSource.asObservable();

  updatePlaylist() {
    this.playlistUpdateSource.next();
  }

  updatePlaylist1() {
    this.playlistUpdatedd$.emit();
  }
}
