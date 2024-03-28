import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGenredetailComponent } from './user-genredetail.component';

describe('UserGenredetailComponent', () => {
  let component: UserGenredetailComponent;
  let fixture: ComponentFixture<UserGenredetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGenredetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserGenredetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
