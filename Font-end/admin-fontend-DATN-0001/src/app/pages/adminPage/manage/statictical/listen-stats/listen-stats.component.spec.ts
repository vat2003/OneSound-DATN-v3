import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListenStatsComponent } from './listen-stats.component';

describe('ListenStatsComponent', () => {
  let component: ListenStatsComponent;
  let fixture: ComponentFixture<ListenStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListenStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListenStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
