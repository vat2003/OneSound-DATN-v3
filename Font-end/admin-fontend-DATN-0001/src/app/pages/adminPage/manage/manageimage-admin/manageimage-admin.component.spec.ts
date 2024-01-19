import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageimageAdminComponent } from './manageimage-admin.component';

describe('ManageimageAdminComponent', () => {
  let component: ManageimageAdminComponent;
  let fixture: ComponentFixture<ManageimageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageimageAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageimageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
