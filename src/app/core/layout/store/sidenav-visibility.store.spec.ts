import { SidenavVisibilityStore } from './sidenav-visibility.store';
import { TestBed } from '@angular/core/testing';

describe('SidenavVisibilityService', () => {
  let service: SidenavVisibilityStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavVisibilityStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
