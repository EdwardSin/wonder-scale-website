import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantShareComponent } from './merchant-share.component';

describe('MerchantShareComponent', () => {
  let component: MerchantShareComponent;
  let fixture: ComponentFixture<MerchantShareComponent>;

  beforeEach(async(() => {
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
