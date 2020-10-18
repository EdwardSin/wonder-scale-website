import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from 'src/app/objects/store';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreService } from '@services/http/public/store.service';
import { ItemService } from '@services/http/public/item.service';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { FacebookService } from 'ngx-facebook';
import * as _ from 'lodash';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { TrackService } from '@services/http/public/track.service';
import { BrowserService } from '@services/general/browser.service';
import { ScreenService } from '@services/general/screen.service';
import { SharedStoreService } from '@services/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';

@Component({
  selector: 'merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  loading: WsLoading = new WsLoading;
  store: Store;
  
  DEBOUNCE_TRACK_VALUE = 15 * 1000;
  storeId;
  trackId;
  isAuthenticated: boolean;
  isSaveLoading: WsLoading = new WsLoading;
  isQrcodeLoading: WsLoading = new WsLoading;
  displayImage: string = '';
  selectedNavItem = 'overview';
  isFollowed: boolean;
  todayDate;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private storeService: StoreService,
    private sharedUserService: SharedUserService,
    private sharedStoreService: SharedStoreService,
    private authFollowService: AuthFollowService,
    private trackService: TrackService,
    private facebookService: FacebookService,
    private itemService: ItemService) {
    let date = new Date;
    this.todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }
  ngOnInit() {
    let id = this.route.snapshot.queryParams.id;
    let username = this.route.snapshot.params.username;
    let isMobileDevice = this.screenService.isMobileDevice.value;
    let nav = this.route.snapshot.queryParams.nav || this.selectedNavItem;
    this.selectedNavItem = nav;
    this.loading.start();
    if (isMobileDevice) {
      if (!this.router.url.includes('/page/mobile/')) {
        this.router.navigate(['/page', 'mobile', username], {queryParams: {id: id}, queryParamsHandling: 'merge' });
      }
    } else {
        this.getStoreById(id);
    }
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isAuthenticated = !!result;
    });

    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.store) {
            DocumentHelper.setWindowTitleWithWonderScale(this.store.name);
          }
        }
      });
  }
  getStoreById(id) {
    this.storeService.getStoreById(id).pipe(tap((result) => {
      this.store = result.result;
      this.authFollowService.isFollowedStore(this.store._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.isFollowed = result['result'];
        this.isSaveLoading.stop();
      })
    }), takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.store) {
        this.sharedStoreService.store.next(this.store);
        DocumentHelper.setWindowTitleWithWonderScale(this.store.name);
        this.isPrivateMode(() => {}, this.recordTrack.bind(this));
        this.loading.stop()
      }
    });
  }
  recordTrack() {
    this.trackId = this.route.snapshot.queryParams.from;
    if (this.isTrackable()) {
      _.delay(() => {
        this.trackService.addTrack({ storeId: this.store._id, trackId: this.trackId, trackExpiration: this.store.trackExpiration }).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result['result']) {
            let track = this.getPreviousTrack();
            if (new Date(track.date).valueOf() == this.todayDate.valueOf()) {
              track.value = _.union(track.value, [this.store._id]);
            } 
            track.date = this.todayDate;
            localStorage.setItem('t_id', JSON.stringify(track));
          }
        })
      }, this.DEBOUNCE_TRACK_VALUE)
    }
  }
  isTrackable() {
    let isTrackable = true;
    let previousTrack = this.getPreviousTrack();
    isTrackable = new Date(previousTrack.date).valueOf() != this.todayDate.valueOf() || typeof previousTrack.value == typeof [] && !previousTrack.value.includes(this.storeId);
    return isTrackable;
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
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
