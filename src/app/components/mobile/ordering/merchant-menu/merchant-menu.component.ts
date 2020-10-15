import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { SharedStoreService } from '@services/shared-store.service';
import { ItemService } from '@services/http/public/item.service';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Store } from '@objects/store';
import * as _ from 'lodash';
import { Phase } from '@objects/phase';
import { CartItem } from '@objects/cart-item';

@Component({
  selector: 'merchant-menu',
  templateUrl: './merchant-menu.component.html',
  styleUrls: ['./merchant-menu.component.scss']
})
export class MerchantMenuComponent implements OnInit {
  allCartItems: Array<CartItem> = [];
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  selectedCategory: string = 'all';
  itemLoading: WsLoading = new WsLoading;
  isNavigationOpened: boolean;
  totalPersons: number = 1;
  store: Store;

  phase: Phase<Number> = new Phase(0, 3);
  paymentFail: boolean;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private ref: ChangeDetectorRef,
    private sharedCartService: SharedCartService,
    private sharedStoreService: SharedStoreService,
    private itemService: ItemService) {
    this.sharedCartService.cartItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.allCartItems = result;
    })
  }
  ngOnInit(): void {
    this.itemLoading.start();
    window.scrollTo({ top: 0 });
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        this.mapStore();
      }
      this.itemLoading.stop();
    });
  }
  ngAfterViewInit() {
  }
  mapStore() {
    if (this.store) {
      this.allItems = this.store['allItems'];
      this.newItems = this.store['newItems'];
      this.discountItems = this.store['discountItems'];
      this.todaySpecialItems = this.store['todaySpecialItems'];
      this.categories = this.store['categories'];
      this.items = this.allItems;
      this.ref.detectChanges();
    }
  }
  getItemsByCategoryId(value) {
    this.itemLoading.start();
    this.isNavigationOpened = false;
    this.selectedCategory = value;
    if (value == 'all') {
      _.delay(() => {
        this.items = this.allItems;
        this.itemLoading.stop()
        this.closeNavigation();
      }, 500);
    } else if (value == 'todayspecial') {
      _.delay(() => {
        this.items = this.todaySpecialItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else if (value == 'discount') {
      _.delay(() => {
        this.items = this.discountItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else if (value == 'new') {
      _.delay(() => {
        this.items = this.newItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else {
      this.itemService.getItemsByCategoryId(value)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
          this.items = result.result;
          this.closeNavigation();
        });
    }
  }
  openNavigation() {
    this.isNavigationOpened = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }
  closeNavigation() {
    this.isNavigationOpened = false;
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }
}
