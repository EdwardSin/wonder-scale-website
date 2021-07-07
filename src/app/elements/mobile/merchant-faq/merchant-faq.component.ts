import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'merchant-faq',
  templateUrl: './merchant-faq.component.html',
  styleUrls: ['./merchant-faq.component.scss']
})
export class MerchantFaqComponent implements OnInit {
  @Input() store;
  @Input() isEditing: boolean;
  @Output() onEditFAQClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteFAQClicked: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

}
