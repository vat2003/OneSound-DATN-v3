import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Changepass2Component } from './changepass2.component';

describe('Changepass2Component', () => {
  let component: Changepass2Component;
  let fixture: ComponentFixture<Changepass2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Changepass2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Changepass2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
