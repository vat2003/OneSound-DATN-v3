import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagegenreAdminComponent } from './managegenre-admin.component';

describe('ManagegenreAdminComponent', () => {
  let component: ManagegenreAdminComponent;
  let fixture: ComponentFixture<ManagegenreAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagegenreAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagegenreAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
