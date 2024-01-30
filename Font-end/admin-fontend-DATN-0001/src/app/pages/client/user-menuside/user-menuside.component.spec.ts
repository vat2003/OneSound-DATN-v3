import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenusideComponent } from './user-menuside.component';

describe('UserMenusideComponent', () => {
  let component: UserMenusideComponent;
  let fixture: ComponentFixture<UserMenusideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenusideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMenusideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
