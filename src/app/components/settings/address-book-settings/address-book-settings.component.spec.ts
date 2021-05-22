import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookSettingsComponent } from './address-book-settings.component';

describe('AddressBookSettingsComponent', () => {
  let component: AddressBookSettingsComponent;
  let fixture: ComponentFixture<AddressBookSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
