import { TestBed } from '@angular/core/testing';

import { AuthReviewService } from './auth-review.service';

describe('AuthReviewService', () => {
  let service: AuthReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
