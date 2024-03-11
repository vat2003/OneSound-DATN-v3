import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaylistModalFromAPIComponent } from './user-playlist-modal-from-api.component';

describe('UserPlaylistModalFromAPIComponent', () => {
  let component: UserPlaylistModalFromAPIComponent;
  let fixture: ComponentFixture<UserPlaylistModalFromAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlaylistModalFromAPIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlaylistModalFromAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
