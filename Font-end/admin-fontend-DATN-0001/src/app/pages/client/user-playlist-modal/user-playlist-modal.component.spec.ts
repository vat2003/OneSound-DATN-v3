import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaylistModalComponent } from './user-playlist-modal.component';

describe('UserPlaylistModalComponent', () => {
  let component: UserPlaylistModalComponent;
  let fixture: ComponentFixture<UserPlaylistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlaylistModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlaylistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
