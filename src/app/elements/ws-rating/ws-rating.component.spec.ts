import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WsRatingComponent } from './ws-rating.component';

describe('WsRatingComponent', () => {
  let component: WsRatingComponent;
  let fixture: ComponentFixture<WsRatingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WsRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
