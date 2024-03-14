import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSongInPlaylistComponent } from './user-song-in-playlist.component';

describe('UserSongInPlaylistComponent', () => {
  let component: UserSongInPlaylistComponent;
  let fixture: ComponentFixture<UserSongInPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSongInPlaylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSongInPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
