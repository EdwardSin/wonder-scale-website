import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemInfoComponent } from './list-item-info.component';

describe('ListItemInfoComponent', () => {
  let component: ListItemInfoComponent;
  let fixture: ComponentFixture<ListItemInfoComponent>;

  beforeEach(async(() => {
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
