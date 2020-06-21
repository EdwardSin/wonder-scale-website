import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Shop } from 'src/app/objects/shop';
import { takeUntil, finalize, map, tap, delay } from 'rxjs/operators';
import { Subject, combineLatest, timer, of } from 'rxjs';
import { ShopService } from '@services/http/public/shop.service';
import { ItemService } from '@services/http/public/item.service';
import { CategoryService } from '@services/http/public/category.service';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { TrackService } from '@services/http/public/track.service';
import { BrowserService } from '@services/general/browser.service';

@Component({
  selector: 'merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  environment = environment;
  selectedCategory: string = 'all';
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  loading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  shop: Shop;
  message = '';
  preview: Boolean;
  DEBOUNCE_TRACK_VALUE = 15 * 1000;
  shopId;
  trackId;
  todayDate;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private trackService: TrackService,
    private itemService: ItemService) {
    let date = new Date;
    this.todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }

  ngOnInit() {
    let id = this.route.snapshot.queryParams.id;
    let preview = this.route.snapshot.queryParams.preview;
    if (preview == 'true') {
      this.getPreviewShopById(id);
    } else {
      this.getShopById(id);
    }

    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.shop) {
            DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
          }
        } 
      });
  }
  isPrivateMode(isPrivateModeCallback, normalModeCallback) {
    let fs = window['RequestFileSystem'] || window['webkitRequestFileSystem'];
    if (BrowserService.isFirefox) {
      let db = indexedDB.open("test");
      db.onerror = isPrivateModeCallback;
      db.onsuccess = normalModeCallback;
    } else if (BrowserService.isSafari) {
      try {
        localStorage.test = 2;        
        normalModeCallback();
      } catch (e) {
        isPrivateModeCallback();
      }
    } else if (BrowserService.isChrome) {
      if (!fs) {
        isPrivateModeCallback();
      } else {
        fs(window['TEMPORARY'],
           100,
           normalModeCallback,
           isPrivateModeCallback);
      }
    } else if (navigator.userAgent.indexOf('Android') > -1) {
      try {
        localStorage.test = 2;
        normalModeCallback();
      } catch (e) {
        isPrivateModeCallback();
      }
    }
  }
  recordTrack() {
    this.trackId = this.route.snapshot.queryParams.from;
    if (this.isTrackable()) {
      _.delay(() => {
        this.trackService.addTrack({ shopId: this.shop._id, trackId: this.trackId, trackExpiration: this.shop.trackExpiration }).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result['result']) {
            let track = this.getPreviousTrack();
            if (new Date(track.date).valueOf() == this.todayDate.valueOf()) {
              track.value.push(this.shop._id);
            } 
            track.date = this.todayDate;
            localStorage.setItem('t_id', JSON.stringify(track));
          }
        })
      }, this.DEBOUNCE_TRACK_VALUE)
    }
  }
  getPreviousTrack() {
    let previousTrackAsString = localStorage.getItem('t_id');
    let previousTrackAsJson;
    let previousTrackAsJsonAsDefault = {
      date: this.todayDate,
      value: []
    };
    if (previousTrackAsString) {
      previousTrackAsJson = JSON.parse(previousTrackAsString);
      if (!previousTrackAsJson || !previousTrackAsJson['date'] || typeof previousTrackAsJson['value'] !== typeof []) {
        previousTrackAsJson = previousTrackAsJsonAsDefault;
      }
    } else {
      previousTrackAsJson = previousTrackAsJsonAsDefault;
    }
    return previousTrackAsJson;
  }
  isTrackable() {
    let isTrackable = true;
    let previousTrack = this.getPreviousTrack();
    isTrackable = new Date(previousTrack.date).valueOf() != this.todayDate.valueOf() || typeof previousTrack.value == typeof [] && !previousTrack.value.includes(this.shopId);
    return isTrackable;
  }
  getShopById(id) {
    this.loading.start();
    this.shopService.getShopById(id).pipe(tap((result) => {
      this.shop = result.result;
      this.mapShop();
    }), takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(() => {
      if (this.shop) {
        DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
        this.isPrivateMode(() => {}, this.recordTrack.bind(this));
      }
    });
  }
  getPreviewShopById(id) {
    this.loading.start();
    this.shopService.getPreviewShopById(id).pipe(tap((result) => {
      this.preview = true;
      this.shop = result.result;
      this.mapShop();
    }), takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(() => {
      if (this.shop) {
        DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
      }
    }, err => {
      this.message = 'You are not authorized to view the page! Please login your account!'
    });
  }
  mapShop() {
    if (this.shop) {
      this.shopId = this.shop._id;
      this.allItems = this.shop['allItems'];
      this.newItems = this.shop['newItems'];
      this.discountItems = this.shop['discountItems'];
      this.todaySpecialItems = this.shop['todaySpecialItems'];
      this.categories = this.shop['categories'];
      this.items = this.allItems;
    }
  }
  // getAllItemsById(id) {
  //   this.itemService.getAllItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     this.allItems = result.result;
  //   });
  // }
  // getNewItemsById(id) {
  //   this.itemService.getNewItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     this.newItems = result.result;
  //   });
  // }
  // getDiscountItemsById(id) {
  //   this.itemService.getDiscountItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     this.discountItems = result.result;
  //   });
  // }
  // getTodaySpecialItemsById(id) {
  //   this.itemService.getTodaySpecialItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     this.todaySpecialItems = result.result;
  //   });
  // }
  // getCategoriesById(id) {
  //   this.categoryService.getCategoriesByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     this.categories = result.result;
  //   })
  // }
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
      combineLatest(timer(500),
        this.itemService.getItemsByCategoryId(value))
        .pipe(takeUntil(this.ngUnsubscribe), map(x => x[1]), finalize(() => this.itemLoading.stop())).subscribe(result => {
          this.items = result.result;
        });
    }
  }
  likeShop() {

  }
  unlikeShop() {

  }
  scrollTo(id = '') {
    if (id) {
      let element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    }
    else {
      window.scrollTo(0, 0);
    }
  }
  closeAlert() {
    this.preview = false;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
