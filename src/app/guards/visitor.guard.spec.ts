import { TestBed, async, inject } from '@angular/core/testing';

import { VisitorGuard } from './visitor.guard';

describe('VisitorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisitorGuard]
    });
  });

  it('should ...', inject([VisitorGuard], (guard: VisitorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
