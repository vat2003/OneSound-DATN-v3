import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagesongAdminComponent } from './managesong-admin.component';

describe('ManagesongAdminComponent', () => {
  let component: ManagesongAdminComponent;
  let fixture: ComponentFixture<ManagesongAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagesongAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagesongAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
