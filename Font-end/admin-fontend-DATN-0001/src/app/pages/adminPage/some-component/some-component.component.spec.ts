import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SomeComponentComponent } from './some-component.component';

describe('SomeComponentComponent', () => {
  let component: SomeComponentComponent;
  let fixture: ComponentFixture<SomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SomeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
