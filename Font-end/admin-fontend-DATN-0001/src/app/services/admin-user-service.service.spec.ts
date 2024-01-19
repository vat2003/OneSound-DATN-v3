import { TestBed } from '@angular/core/testing';

import { AdminUserServiceService } from './admin-user-service.service';

describe('AdminUserServiceService', () => {
  let service: AdminUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
