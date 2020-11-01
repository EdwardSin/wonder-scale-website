import { Component, OnInit, ChangeDetectorRef, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Store } from '@objects/store';
import * as _ from 'lodash';
import { Phase } from '@objects/phase';

@Component({
  selector: 'merchant-menu',
  templateUrl: './merchant-menu.component.html',
  styleUrls: ['./merchant-menu.component.scss']
})
export class MerchantMenuComponent implements OnInit {
  @Input() store: Store;
  @Input() isEditing: boolean;
  @Input() itemService;
  @Input() navigateToStore;
  @Input() menuImages;
  @Output() onEditQuickMenuClicked: EventEmitter<any> = new EventEmitter;
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
  isQuickMenuOpened: boolean;
  selectedQuickMenuIndex: number = 0;
  phase: Phase<Number> = new Phase(0, 3);
  paymentFail: boolean;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private ref: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    window.scrollTo({ top: 0 });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['store'] && this.store) {
      this.mapStore();
    }
    if (changes['menuImages'] && this.menuImages) {
      setTimeout(() => {
        let mySwiper = document.querySelector('.swiper-container');
        if (mySwiper) {
            let swiper = mySwiper['swiper']
            swiper.update();
        };
      }, 300);
    }
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
  openQuickMenu(index) {
    this.isQuickMenuOpened = true;
    this.selectedQuickMenuIndex = index;
  }
}
