import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantMobileShareComponent } from './merchant-mobile-share.component';

describe('MerchantMobileShareComponent', () => {
  let component: MerchantMobileShareComponent;
  let fixture: ComponentFixture<MerchantMobileShareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMobileShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMobileShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
