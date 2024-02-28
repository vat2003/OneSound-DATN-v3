import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountAccessComponent } from './count-access.component';

describe('CountAccessComponent', () => {
  let component: CountAccessComponent;
  let fixture: ComponentFixture<CountAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountAccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
