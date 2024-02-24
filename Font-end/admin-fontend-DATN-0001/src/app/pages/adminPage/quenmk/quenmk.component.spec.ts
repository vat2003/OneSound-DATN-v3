import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuenmkComponent } from './quenmk.component';

describe('QuenmkComponent', () => {
  let component: QuenmkComponent;
  let fixture: ComponentFixture<QuenmkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuenmkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuenmkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
