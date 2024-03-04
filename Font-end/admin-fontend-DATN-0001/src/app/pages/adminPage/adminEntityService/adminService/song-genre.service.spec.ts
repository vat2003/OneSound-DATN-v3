import { TestBed } from '@angular/core/testing';

import { SongGenreService } from './song-genre.service';

describe('SongGenreService', () => {
  let service: SongGenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
