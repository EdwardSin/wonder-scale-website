import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantMobileFooterComponent } from './merchant-mobile-footer.component';

describe('MerchantMobileFooterComponent', () => {
  let component: MerchantMobileFooterComponent;
  let fixture: ComponentFixture<MerchantMobileFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMobileFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMobileFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
