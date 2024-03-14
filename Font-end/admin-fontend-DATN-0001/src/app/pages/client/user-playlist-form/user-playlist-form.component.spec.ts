import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaylistFormComponent } from './user-playlist-form.component';

describe('UserPlaylistFormComponent', () => {
  let component: UserPlaylistFormComponent;
  let fixture: ComponentFixture<UserPlaylistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlaylistFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlaylistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
