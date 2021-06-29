import { TestBed } from '@angular/core/testing';

import { OnSellingItemService } from './on-selling-item.service';

describe('OnSellingItemService', () => {
  let service: OnSellingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnSellingItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
