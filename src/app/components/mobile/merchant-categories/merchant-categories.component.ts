import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { SharedShopService } from '@services/shared-shop.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Shop } from '@objects/shop';
import * as _ from 'lodash';
import { ItemService } from '@services/http/public/item.service';

@Component({
  selector: 'merchant-categories',
  templateUrl: './merchant-categories.component.html',
  styleUrls: ['./merchant-categories.component.scss']
})
export class MerchantCategoriesComponent implements OnInit {
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  selectedCategory: string = 'all';
  itemLoading: WsLoading = new WsLoading;
  shop: Shop;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService,
    private itemService: ItemService) { 
  }

  ngOnInit(): void {
    this.itemLoading.start();
    window.scrollTo({top: 0});
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.shop = result;
        this.mapShop();
        this.itemLoading.stop();
      }
    });
  }
  mapShop() {
    if (this.shop) {
      this.allItems = this.shop['allItems'];
      this.newItems = this.shop['newItems'];
      this.discountItems = this.shop['discountItems'];
      this.todaySpecialItems = this.shop['todaySpecialItems'];
      this.categories = this.shop['categories'];
      this.items = this.allItems;
    }
  }
  getItemsByCategoryId(value) {
    this.itemLoading.start();
    if (value == 'all') {
      _.delay(() => {
        this.items = this.allItems;
        this.itemLoading.stop()
      }, 500);
    } else if (value == 'todayspecial') {
      _.delay(() => {
        this.items = this.todaySpecialItems;
        this.itemLoading.stop();
      }, 500);
    } else if (value == 'discount') {
      _.delay(() => {
        this.items = this.discountItems;
        this.itemLoading.stop();
      }, 500);
    } else if (value == 'new') {
      _.delay(() => {
        this.items = this.newItems;
        this.itemLoading.stop();
      }, 500);
    } else {
        this.itemService.getItemsByCategoryId(value)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
          this.items = result.result;
        });
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
