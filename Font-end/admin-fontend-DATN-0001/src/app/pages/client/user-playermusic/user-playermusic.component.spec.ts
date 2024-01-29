import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlayermusicComponent } from './user-playermusic.component';

describe('UserPlayermusicComponent', () => {
  let component: UserPlayermusicComponent;
  let fixture: ComponentFixture<UserPlayermusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlayermusicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlayermusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
