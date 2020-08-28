import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { CartItem } from '@objects/cart-item';

@Injectable({
  providedIn: 'root'
})
export class SharedCartService {
  cartItems: BehaviorSubject<Array<CartItem>> = new BehaviorSubject<Array<CartItem>>([]);

  constructor() { }

  addCartItem(cartItem: CartItem) {
    this.cartItems.next(<CartItem[]>[...this.cartItems.getValue(), cartItem])
  }
  removeCartItem(cartItem) {
    this.cartItems.next(_.pull(this.cartItems.getValue(), cartItem));
  }
}
