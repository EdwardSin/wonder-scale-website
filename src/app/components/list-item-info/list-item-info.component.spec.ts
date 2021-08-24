import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListItemInfoComponent } from './list-item-info.component';

describe('ListItemInfoComponent', () => {
  let component: ListItemInfoComponent;
  let fixture: ComponentFixture<ListItemInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
