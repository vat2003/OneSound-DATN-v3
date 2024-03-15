import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListSongFormPlayListComponent } from './play-list-song-form-play-list.component';

describe('PlayListSongFormPlayListComponent', () => {
  let component: PlayListSongFormPlayListComponent;
  let fixture: ComponentFixture<PlayListSongFormPlayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayListSongFormPlayListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayListSongFormPlayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
