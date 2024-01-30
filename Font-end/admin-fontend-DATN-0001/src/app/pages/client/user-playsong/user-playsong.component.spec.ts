import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlaysongComponent } from './user-playsong.component';

describe('UserPlaysongComponent', () => {
  let component: UserPlaysongComponent;
  let fixture: ComponentFixture<UserPlaysongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPlaysongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPlaysongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
