import { Component, OnInit } from '@angular/core';
import * as myList from '../../../../seo/routes.json';

@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.scss']
})
export class UrlListComponent implements OnInit {
  list: any = [];
  constructor() { }

  ngOnInit() {
    this.list = myList['default'];
  }
}
