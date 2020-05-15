import { TestBed } from '@angular/core/testing';

import { AuthFollowService } from './auth-follow.service';

describe('AuthFollowService', () => {
  let service: AuthFollowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFollowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
