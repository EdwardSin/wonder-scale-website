import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantFaqComponent } from './merchant-faq.component';

describe('MerchantFaqComponent', () => {
  let component: MerchantFaqComponent;
  let fixture: ComponentFixture<MerchantFaqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
