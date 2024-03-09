import { TestBed } from '@angular/core/testing';

import { SongSingerService } from './song-singer.service';

describe('SongSingerService', () => {
  let service: SongSingerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongSingerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
