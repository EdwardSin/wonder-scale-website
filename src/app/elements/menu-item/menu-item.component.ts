import { Component, OnInit, Input } from '@angular/core';
import { CurrencyService } from '@services/http/general/currency.service';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { CartItem } from '@objects/cart-item';
import { Item } from '@objects/item';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() item: Item;
  quantity: number = 1;
  type: string = '';
  remark: string;
  isShown: boolean;
  isImagesOpened: boolean;
  selectedImagesIndex: number = 0;
  environment = environment;
  selectedType = '';
  ngUnsubscribe: Subject<any> = new Subject;
  constructor(public currencyService: CurrencyService, private sharedCartService: SharedCartService) { }

  ngOnInit(): void {
  }
  increase() {
    this.quantity++;
  }
  addToCart() {
    let cartItem: CartItem = new CartItem();
    cartItem.name = this.item.name
    cartItem.price = this.item.price;
    cartItem.currency = this.item.currency;
    cartItem.type = this.selectedType;
    cartItem.quantity = this.quantity;
    cartItem.remark = this.remark;
    this.sharedCartService.addCartItem(cartItem);
    this.resetFields();
  }
  decrease() {
    this.quantity--;
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }
  resetFields() {
    this.isShown = false;
    this.quantity = 1;
    this.type = '';
    this.remark = '';
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
