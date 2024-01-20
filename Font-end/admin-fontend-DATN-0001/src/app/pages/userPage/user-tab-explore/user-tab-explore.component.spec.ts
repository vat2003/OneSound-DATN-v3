import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabExploreComponent } from './user-tab-explore.component';

describe('UserTabExploreComponent', () => {
  let component: UserTabExploreComponent;
  let fixture: ComponentFixture<UserTabExploreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTabExploreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTabExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
