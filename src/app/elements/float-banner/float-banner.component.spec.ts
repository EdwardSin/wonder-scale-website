import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatBannerComponent } from './float-banner.component';

describe('FloatBannerComponent', () => {
  let component: FloatBannerComponent;
  let fixture: ComponentFixture<FloatBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
