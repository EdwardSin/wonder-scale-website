import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsRatingComponent } from './ws-rating.component';

describe('WsRatingComponent', () => {
  let component: WsRatingComponent;
  let fixture: ComponentFixture<WsRatingComponent>;

  beforeEach(async(() => {
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
