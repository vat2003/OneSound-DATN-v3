import { TestBed } from '@angular/core/testing';

import { StaticticalService } from './statictical.service';

describe('StaticticalService', () => {
  let service: StaticticalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticticalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
