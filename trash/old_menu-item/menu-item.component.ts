import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { CartItem } from '@objects/cart-item';
import { Item } from '@objects/item';
import { takeUntil } from 'rxjs/operators';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as _ from 'lodash';

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
  selectedType = '';  ngUnsubscribe: Subject<any> = new Subject;
  cartItems: Array<CartItem> = [];
  isAddedToCart: boolean;
  images: Array<string> = [];
  imageIndex: number;
  constructor(private sharedCartService: SharedCartService) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes['item']) {
      this.images = _.union(_.flattenDeep([this.item.profileImages, this.item.types.map(type => type.images), (this.item.descriptionImages || [])]));
      this.images = _.filter(this.images, image => !_.isEmpty(image));
      this.imageIndex = this.item.profileImageIndex > -1 ? this.item.profileImageIndex : 0;
      // this.item.isDiscountExisting = this.item.isOffer && (this.item.types.find(type => type.discount > 0) != null || this.item.discount > 0);
    }
  }
  ngOnInit(): void {
    this.sharedCartService.cartItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(cartItems => {
      this.cartItems = cartItems;
      this.isAddedToCart = this.cartItems.filter(cartItem => {
        return cartItem.itemId == this.item._id;
      }).length > 0;
    });
  }
  increase() {
    this.quantity++;
  }
  addToCart() {
    if (this.item?.types?.length > 0 && !this.selectedType) {
      WsToastService.toastSubject.next({ content: 'Please select a type!', type: 'danger'});
      return;
    }
    let cartItem: CartItem = new CartItem();
    cartItem.itemId = this.item._id;
    cartItem.name = this.item.name;
    cartItem.price = this.item.price;
    cartItem.currency = this.item.currency;
    cartItem.discount = 0;
    cartItem.type = this.selectedType == null ? undefined : this.selectedType;
    cartItem.quantity = this.quantity;
    cartItem.remark = this.remark;
    if (this.images.length && this.imageIndex > -1) {
      cartItem.profileImage = this.images[this.imageIndex];
    }
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
