import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantShareComponent } from './merchant-share.component';

describe('MerchantShareComponent', () => {
  let component: MerchantShareComponent;
  let fixture: ComponentFixture<MerchantShareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
