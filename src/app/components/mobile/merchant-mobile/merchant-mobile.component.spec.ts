import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantMobileComponent } from './merchant-mobile.component';

describe('MerchantMobileComponent', () => {
  let component: MerchantMobileComponent;
  let fixture: ComponentFixture<MerchantMobileComponent>;

  beforeEach(async(() => {
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
