import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHomeComponentComponent } from './user-home-component.component';

describe('UserHomeComponentComponent', () => {
  let component: UserHomeComponentComponent;
  let fixture: ComponentFixture<UserHomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHomeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserHomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
