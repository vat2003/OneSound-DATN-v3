import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlayerApiYoutubeComponent } from './user-player-api-youtube.component';

describe('UserPlayerApiYoutubeComponent', () => {
  let component: UserPlayerApiYoutubeComponent;
  let fixture: ComponentFixture<UserPlayerApiYoutubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlayerApiYoutubeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlayerApiYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
