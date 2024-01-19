import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageuserAdminComponent } from './manageuser-admin.component';

describe('ManageuserAdminComponent', () => {
  let component: ManageuserAdminComponent;
  let fixture: ComponentFixture<ManageuserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageuserAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageuserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
