import { TestBed } from '@angular/core/testing';

import { SharedShopService } from './shared-shop.service';

describe('SharedShopService', () => {
  let service: SharedShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
