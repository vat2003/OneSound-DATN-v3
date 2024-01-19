import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageartistAdminComponent } from './manageartist-admin.component';

describe('ManageartistAdminComponent', () => {
  let component: ManageartistAdminComponent;
  let fixture: ComponentFixture<ManageartistAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageartistAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageartistAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
