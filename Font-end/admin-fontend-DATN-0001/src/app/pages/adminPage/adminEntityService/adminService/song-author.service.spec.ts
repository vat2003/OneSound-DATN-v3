import { TestBed } from '@angular/core/testing';

import { SongAuthorService } from './song-author.service';

describe('SongAuthorService', () => {
  let service: SongAuthorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongAuthorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
