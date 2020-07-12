import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Shop } from 'src/app/objects/shop';
import { takeUntil, finalize, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShopService } from '@services/http/public/shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as _ from 'lodash';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { TrackService } from '@services/http/public/track.service';
import { BrowserService } from '@services/general/browser.service';
import { ScreenService } from '@services/general/screen.service';
import { SharedShopService } from '@services/shared-shop.service';


@Component({
  selector: 'merchant-mobile',
  templateUrl: './merchant-mobile.component.html',
  styleUrls: ['./merchant-mobile.component.scss']
})
export class MerchantMobileComponent implements OnInit {
  loading: WsLoading = new WsLoading;
  shop: Shop;
  message = '';
  preview: Boolean;
  DEBOUNCE_TRACK_VALUE = 15 * 1000;
  shopId;
  isShownSelection = false;
  trackId;
  todayDate;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private shopService: ShopService,
    private sharedShopService: SharedShopService,
    private trackService: TrackService) {
    let date = new Date;
    this.todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }
  ngOnInit() {
    let id = this.route.snapshot.queryParams.id;
    let username = this.route.snapshot.params.username;
    let isMobileDevice = this.screenService.isMobileDevice.value;
    let preview = this.route.snapshot.queryParams.preview;
    if (isMobileDevice) {
      if (preview == 'true') {
        this.getPreviewShopById(id);
      } else {
        this.getShopById(id);
      }
    } else {
      if (this.router.url.includes('/page/mobile/')) {
        this.router.navigate(['/page', username], {queryParams: {id}, queryParamsHandling: 'merge' });
      }
    }

    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.shop) {
            DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
          }
          if (preview == 'true' && !this.shop) {
            this.getPreviewShopById(id);
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
      if (!previousTrackAsJson || !previousTrackAsJson['date'] || typeof previousTrackAsJson['value'] !== typeof [] || 
        new Date(previousTrackAsJson['date']).toString() != previousTrackAsJsonAsDefault['date'].toString()) {
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
  showSelection() {
    let type = this.route.snapshot.queryParams.type;
    if (type == 'qr_scan') {
      this.isShownSelection = true;
    }
  }
  getShopById(id) {
    this.loading.start();
    this.showSelection();
    this.shopService.getShopById(id).pipe(tap((result) => {
      this.shop = result.result;
    }), takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.shop) {
        DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
        this.shopId = this.shop._id;
        this.isPrivateMode(() => {}, this.recordTrack.bind(this));
        this.sharedShopService.shop.next(this.shop);
        this.router.navigate([], { queryParams: {type: null}, queryParamsHandling: 'merge' });
      } else {
        this.isShownSelection = false;
      }
      this.loading.stop();
    }, () => {
      this.loading.stop();
      this.isShownSelection = false;
    });
  }
  getPreviewShopById(id) {
    this.loading.start();
    this.shopService.getPreviewShopById(id).pipe(tap((result) => {
      this.preview = true;
      this.shop = result.result;
    }), takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(() => {
      if (this.shop) {
        DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
        this.sharedShopService.shop.next(this.shop);
      }
    }, err => {
      this.message = 'You are not authorized to view the page! Please login your account!'
    });
  }
  navigateToDetails() {
    this.isShownSelection = false;
  }
  navigateToItems() {
    this.isShownSelection = false;
  }
  closeAlert() {
    this.preview = false;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.sharedShopService.shop.next(null);
  }
}
