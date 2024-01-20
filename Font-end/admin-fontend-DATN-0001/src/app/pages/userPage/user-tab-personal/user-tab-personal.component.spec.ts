import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabPersonalComponent } from './user-tab-personal.component';

describe('UserTabPersonalComponent', () => {
  let component: UserTabPersonalComponent;
  let fixture: ComponentFixture<UserTabPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTabPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTabPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
