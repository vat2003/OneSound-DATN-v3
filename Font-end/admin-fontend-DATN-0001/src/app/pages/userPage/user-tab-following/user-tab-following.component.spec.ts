import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabFollowingComponent } from './user-tab-following.component';

describe('UserTabFollowingComponent', () => {
  let component: UserTabFollowingComponent;
  let fixture: ComponentFixture<UserTabFollowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTabFollowingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTabFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
