import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantMobileFaqComponent } from './merchant-mobile-faq.component';

describe('MerchantMobileFaqComponent', () => {
  let component: MerchantMobileFaqComponent;
  let fixture: ComponentFixture<MerchantMobileFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMobileFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMobileFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
