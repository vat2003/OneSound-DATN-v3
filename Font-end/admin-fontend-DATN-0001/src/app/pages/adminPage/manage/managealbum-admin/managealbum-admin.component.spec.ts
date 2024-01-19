import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagealbumAdminComponent } from './managealbum-admin.component';

describe('ManagealbumAdminComponent', () => {
  let component: ManagealbumAdminComponent;
  let fixture: ComponentFixture<ManagealbumAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagealbumAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagealbumAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
