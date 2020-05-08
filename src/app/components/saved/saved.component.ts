import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit {
  items = [{}, {}, {}, {}, {}, {}, {}, {}, {}]
  constructor() { }

  ngOnInit(): void {
  }

}
