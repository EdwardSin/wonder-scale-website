import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantMobileFooterComponent } from './merchant-mobile-footer.component';

describe('MerchantMobileFooterComponent', () => {
  let component: MerchantMobileFooterComponent;
  let fixture: ComponentFixture<MerchantMobileFooterComponent>;

  beforeEach(async(() => {
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
