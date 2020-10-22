import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantMobileInfoComponent } from './merchant-mobile-info.component';

describe('MerchantMobileInfoComponent', () => {
  let component: MerchantMobileInfoComponent;
  let fixture: ComponentFixture<MerchantMobileInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMobileInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMobileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
