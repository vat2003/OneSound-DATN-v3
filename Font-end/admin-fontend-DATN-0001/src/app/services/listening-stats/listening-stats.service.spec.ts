import { TestBed } from '@angular/core/testing';

import { ListeningStatsService } from './listening-stats.service';

describe('ListeningStatsService', () => {
  let service: ListeningStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeningStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
