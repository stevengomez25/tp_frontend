import { TestBed } from '@angular/core/testing';

import { BillingService } from './billing';

describe('Billing', () => {
  let service: BillingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
