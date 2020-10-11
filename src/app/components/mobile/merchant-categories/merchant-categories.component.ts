import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { SharedStoreService } from '@services/shared-store.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@objects/store';
import * as _ from 'lodash';
import { ItemService } from '@services/http/public/item.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'merchant-categories',
  templateUrl: './merchant-categories.component.html',
  styleUrls: ['./merchant-categories.component.scss']
})
export class MerchantCategoriesComponent implements OnInit {
  environment = environment;
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  selectedCategory: string = 'all';
  itemLoading: WsLoading = new WsLoading;
  isMenuOpened: boolean = false;
  selectedMenuIndex: number = 0;
  store: Store;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    private itemService: ItemService) { 
  }

  ngOnInit(): void {
    this.itemLoading.start();
    window.scrollTo({top: 0});
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        this.mapStore();
        this.itemLoading.stop();
      }
    });
  }
  mapStore() {
    if (this.store) {
      this.allItems = this.store['allItems'];
      this.newItems = this.store['newItems'];
      this.discountItems = this.store['discountItems'];
      this.todaySpecialItems = this.store['todaySpecialItems'];
      this.categories = this.store['categories'];
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
  openMenu(index) {
    this.isMenuOpened = true;
    this.selectedMenuIndex = index;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
