import { TestBed } from '@angular/core/testing';

import { DataGlobalService } from './data-global.service';

describe('DataGlobalService', () => {
  let service: DataGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
