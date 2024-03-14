import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaylistYoutubeModalComponentComponent } from './user-playlist-youtube-modal-component.component';

describe('UserPlaylistYoutubeModalComponentComponent', () => {
  let component: UserPlaylistYoutubeModalComponentComponent;
  let fixture: ComponentFixture<UserPlaylistYoutubeModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlaylistYoutubeModalComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlaylistYoutubeModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
