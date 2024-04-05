import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryListensComponent } from './history-listens.component';

describe('HistoryListensComponent', () => {
  let component: HistoryListensComponent;
  let fixture: ComponentFixture<HistoryListensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryListensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryListensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
