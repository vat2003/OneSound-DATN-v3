import { TestBed } from '@angular/core/testing';

import { FirebaseStorageCrudService } from './firebase-storage-crud.service';

describe('FirebaseStorageCrudService', () => {
  let service: FirebaseStorageCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseStorageCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
