import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantFooterComponent } from './merchant-footer.component';

describe('MerchantFooterComponent', () => {
  let component: MerchantFooterComponent;
  let fixture: ComponentFixture<MerchantFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
