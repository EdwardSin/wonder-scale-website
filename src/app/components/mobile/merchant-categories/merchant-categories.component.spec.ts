import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCategoriesComponent } from './merchant-categories.component';

describe('MerchantCategoriesComponent', () => {
  let component: MerchantCategoriesComponent;
  let fixture: ComponentFixture<MerchantCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
