import { TestBed } from '@angular/core/testing';

import { SingerServiceService } from './singer-service.service';

describe('SingerServiceService', () => {
  let service: SingerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
