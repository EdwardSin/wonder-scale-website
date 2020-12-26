import { TestBed } from '@angular/core/testing';

import { OrderReceiptService } from './order-receipt.service';

describe('OrderReceiptService', () => {
  let service: OrderReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
