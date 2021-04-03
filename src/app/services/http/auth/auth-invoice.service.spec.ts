import { TestBed } from '@angular/core/testing';

import { AuthInvoiceService } from './auth-invoice.service';

describe('AuthInvoiceService', () => {
  let service: AuthInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
