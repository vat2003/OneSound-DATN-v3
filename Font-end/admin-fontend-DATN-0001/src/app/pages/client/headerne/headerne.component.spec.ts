import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderneComponent } from './headerne.component';

describe('HeaderneComponent', () => {
  let component: HeaderneComponent;
  let fixture: ComponentFixture<HeaderneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
