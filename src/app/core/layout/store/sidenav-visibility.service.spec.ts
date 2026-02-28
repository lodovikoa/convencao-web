import { SidenavVisibilityService } from './sidenav-visibility.service';
import { TestBed } from '@angular/core/testing';

describe('SidenavVisibilityService', () => {
  let service: SidenavVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
