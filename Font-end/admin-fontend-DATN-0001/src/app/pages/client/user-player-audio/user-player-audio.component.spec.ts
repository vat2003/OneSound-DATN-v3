import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlayerAudioComponent } from './user-player-audio.component';

describe('UserPlayerAudioComponent', () => {
  let component: UserPlayerAudioComponent;
  let fixture: ComponentFixture<UserPlayerAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlayerAudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlayerAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
