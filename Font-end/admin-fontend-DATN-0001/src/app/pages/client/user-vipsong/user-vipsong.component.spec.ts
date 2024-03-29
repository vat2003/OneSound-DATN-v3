import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVipsongComponent } from './user-vipsong.component';

describe('UserVipsongComponent', () => {
  let component: UserVipsongComponent;
  let fixture: ComponentFixture<UserVipsongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVipsongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserVipsongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
