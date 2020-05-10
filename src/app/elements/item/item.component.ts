import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '@objects/item';
import { environment } from '@environments/environment';
import { CurrencyService } from '@services/http/general/currency.service';
import { ItemService } from '@services/http/public/item.service';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: number;
  @Input() savable: boolean = true;
  @Input() removable: boolean;
  @Input() like: boolean;
  @Output() likeChanged: EventEmitter<any> = new EventEmitter; 
  environment = environment;
  constructor(public currencyService: CurrencyService) { }

  ngOnInit(): void {
  }
  likeClicked(like) {
    this.likeChanged.emit(!like);
  }
}
