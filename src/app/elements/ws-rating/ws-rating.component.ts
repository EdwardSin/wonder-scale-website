import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-rating',
  templateUrl: './ws-rating.component.html',
  styleUrls: ['./ws-rating.component.scss']
})
export class WsRatingComponent implements OnInit {
  @Input() rating: Number;
  @Input() name: string;
  @Output() ratingChange: EventEmitter<Number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  onValueChanged(event) {
    this.ratingChange.emit(+event.target.value);
  }
}
