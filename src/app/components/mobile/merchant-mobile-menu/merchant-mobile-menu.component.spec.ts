import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantMobileMenuComponent } from './merchant-mobile-menu.component';

describe('MerchantMobileMenuComponent', () => {
  let component: MerchantMobileMenuComponent;
  let fixture: ComponentFixture<MerchantMobileMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMobileMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
