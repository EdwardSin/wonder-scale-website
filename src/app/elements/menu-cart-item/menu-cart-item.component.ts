import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { CartItem } from '@objects/cart-item';
import { Item } from '@objects/item';
import { takeUntil } from 'rxjs/operators';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';

@Component({
  selector: 'menu-cart-item',
  templateUrl: './menu-cart-item.component.html',
  styleUrls: ['./menu-cart-item.component.scss']
})
export class MenuCartItemComponent implements OnInit {
  @Input() item: CartItem;
  quantity: number = 1;
  type: string = '';
  remark: string;
  isShown: boolean;
  isImagesOpened: boolean;
  selectedImagesIndex: number = 0;
  environment = environment;
  selectedType = '';
  currencies = [];
  ngUnsubscribe: Subject<any> = new Subject;
  cartItems: Array<CartItem> = [];
  constructor(private sharedCartService: SharedCartService) { }

  ngOnInit(): void {
    this.sharedCartService.cartItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(cartItems => {
      this.cartItems = cartItems;
    });
  }
  increase() {
    this.item.quantity++;
  }
  decrease() {
    this.item.quantity--;
    if (this.item.quantity < 1) {
      this.item.quantity = 1;
    }
  }
  removeFromCartItems() {
    this.cartItems = this.cartItems.filter(x => x !== this.item);
    this.sharedCartService.cartItems.next(this.cartItems);
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
