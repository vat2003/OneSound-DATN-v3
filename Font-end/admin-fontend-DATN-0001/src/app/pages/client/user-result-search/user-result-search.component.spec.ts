import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResultSearchComponent } from './user-result-search.component';

describe('UserResultSearchComponent', () => {
  let component: UserResultSearchComponent;
  let fixture: ComponentFixture<UserResultSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserResultSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserResultSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
