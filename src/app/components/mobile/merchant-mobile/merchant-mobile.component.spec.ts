import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantMobileComponent } from './merchant-mobile.component';

describe('MerchantMobileComponent', () => {
  let component: MerchantMobileComponent;
  let fixture: ComponentFixture<MerchantMobileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
