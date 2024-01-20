import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabRadioComponent } from './user-tab-radio.component';

describe('UserTabRadioComponent', () => {
  let component: UserTabRadioComponent;
  let fixture: ComponentFixture<UserTabRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTabRadioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTabRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
