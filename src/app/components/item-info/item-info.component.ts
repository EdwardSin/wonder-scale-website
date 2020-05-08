import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss']
})
export class ItemInfoComponent implements OnInit {
  descriptionImages = [{}, {}, {}, {}, {}, {}, {}];
  itemTypes = [{}, {}, {}, {}];
  constructor() { }

  ngOnInit(): void {
  }

}
