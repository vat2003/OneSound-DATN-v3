import { TestBed } from '@angular/core/testing';

import { SingerAlbumService } from './singer-album.service';

describe('SingerAlbumService', () => {
  let service: SingerAlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingerAlbumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
