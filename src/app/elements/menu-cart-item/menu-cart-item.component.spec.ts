import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuCartItemComponent } from './menu-cart-item.component';

describe('MenuCartItemComponent', () => {
  let component: MenuCartItemComponent;
  let fixture: ComponentFixture<MenuCartItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCartItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
