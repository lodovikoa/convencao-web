import { TestBed } from '@angular/core/testing';

import { LoggedInUserStoreService } from './logged-in-user-store.service';

describe('LoggedInUserStoreService', () => {
  let service: LoggedInUserStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedInUserStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
