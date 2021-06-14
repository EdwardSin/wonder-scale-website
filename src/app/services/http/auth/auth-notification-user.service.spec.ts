import { TestBed } from '@angular/core/testing';

import { AuthNotificationUserService } from './auth-notification-user.service';

describe('AuthNotificationUserService', () => {
  let service: AuthNotificationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthNotificationUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
