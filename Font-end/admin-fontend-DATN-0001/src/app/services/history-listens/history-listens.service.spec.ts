import { TestBed } from '@angular/core/testing';

import { HistoryListensService } from './history-listens.service';

describe('HistoryListensService', () => {
  let service: HistoryListensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryListensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
