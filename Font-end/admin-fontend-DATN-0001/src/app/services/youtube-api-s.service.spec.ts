import { TestBed } from '@angular/core/testing';

import { YoutubeApiSService } from './youtube-api-s.service';

describe('YoutubeApiSService', () => {
  let service: YoutubeApiSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeApiSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
