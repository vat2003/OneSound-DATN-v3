import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabChartsComponent } from './user-tab-charts.component';

describe('UserTabChartsComponent', () => {
  let component: UserTabChartsComponent;
  let fixture: ComponentFixture<UserTabChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTabChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTabChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
