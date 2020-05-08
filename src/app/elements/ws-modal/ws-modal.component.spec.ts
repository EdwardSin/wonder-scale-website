import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsModalComponent } from './ws-modal.component';

describe('WsModalComponent', () => {
  let component: WsModalComponent;
  let fixture: ComponentFixture<WsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
