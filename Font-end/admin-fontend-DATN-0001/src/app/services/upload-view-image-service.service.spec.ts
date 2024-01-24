import { TestBed } from '@angular/core/testing';

import { UploadViewImageServiceService } from './upload-view-image-service.service';

describe('UploadViewImageServiceService', () => {
  let service: UploadViewImageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadViewImageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
