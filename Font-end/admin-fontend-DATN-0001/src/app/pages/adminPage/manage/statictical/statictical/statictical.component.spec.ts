import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticticalComponent } from './statictical.component';

describe('StaticticalComponent', () => {
  let component: StaticticalComponent;
  let fixture: ComponentFixture<StaticticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticticalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaticticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
