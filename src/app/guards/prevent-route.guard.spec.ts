import { TestBed } from '@angular/core/testing';

import { PreventRouteGuard } from './prevent-route.guard';

describe('PreventRouteGuard', () => {
  let guard: PreventRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
