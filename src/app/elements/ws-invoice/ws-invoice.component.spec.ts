import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsInvoiceComponent } from './ws-invoice.component';

describe('WsInvoiceComponent', () => {
  let component: WsInvoiceComponent;
  let fixture: ComponentFixture<WsInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
