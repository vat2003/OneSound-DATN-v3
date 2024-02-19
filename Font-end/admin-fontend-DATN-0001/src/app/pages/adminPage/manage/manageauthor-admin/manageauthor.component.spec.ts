import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageauthorComponent } from './manageauthor.component';

describe('ManageauthorComponent', () => {
  let component: ManageauthorComponent;
  let fixture: ComponentFixture<ManageauthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageauthorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageauthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
