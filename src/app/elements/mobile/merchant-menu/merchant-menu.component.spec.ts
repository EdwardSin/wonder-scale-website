import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantMenuComponent } from './merchant-menu.component';

describe('MerchantMenuComponent', () => {
  let component: MerchantMenuComponent;
  let fixture: ComponentFixture<MerchantMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
