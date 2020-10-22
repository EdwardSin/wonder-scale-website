import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from 'src/app/objects/store';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreService } from '@services/http/public/store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as _ from 'lodash';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { TrackService } from '@services/http/public/track.service';
import { BrowserService } from '@services/general/browser.service';
import { ScreenService } from '@services/general/screen.service';
import { SharedStoreService } from '@services/shared-store.service';


@Component({
  selector: 'merchant-mobile',
  templateUrl: './merchant-mobile.component.html',
  styleUrls: ['./merchant-mobile.component.scss']
})
export class MerchantMobileComponent implements OnInit {
  loading: WsLoading = new WsLoading;
  store: Store;
  message = '';
  preview: Boolean;
  DEBOUNCE_TRACK_VALUE = 15 * 1000;
  storeId;
  isShownSelection = false;
  trackId;
  todayDate;
  showFooter: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private storeService: StoreService,
    private sharedStoreService: SharedStoreService,
    private trackService: TrackService) {
    let date = new Date;
    this.todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }
  ngOnInit() {
    let id = this.route.snapshot.queryParams.id;
    let username = this.route.snapshot.params.username;
    let isMobileDevice = this.screenService.isMobileDevice.value;
    if (isMobileDevice) {
      this.getStoreById(id);
    } else {
      if (this.router.url.includes('/page/mobile/')) {
        this.router.navigate(['/page', username], {queryParams: {id}, queryParamsHandling: 'merge' });
      }
    }
    this.showFooter = !this.router.url.includes('/menu');
    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.store) {
            DocumentHelper.setWindowTitleWithWonderScale(this.store.name);
          }
          this.showFooter = !this.router.url.includes('/menu')
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
        this.trackService.addTrack({ storeId: this.store._id, trackId: this.trackId, trackExpiration: this.store.trackExpiration }).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result['result']) {
            let track = this.getPreviousTrack();
            if (new Date(track.date).valueOf() == this.todayDate.valueOf()) {
              track.value.push(this.store._id);
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
    isTrackable = new Date(previousTrack.date).valueOf() != this.todayDate.valueOf() || typeof previousTrack.value == typeof [] && !previousTrack.value.includes(this.storeId);
    return isTrackable;
  }
  showSelection() {
    let type = this.route.snapshot.queryParams.type;
    if (type == 'qr_scan') {
      this.isShownSelection = true;
    }
  }
  getStoreById(id) {
    this.loading.start();
    this.showSelection();
    this.storeService.getStoreById(id).pipe(tap((result) => {
      this.store = result.result;
    }), takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.store) {
        DocumentHelper.setWindowTitleWithWonderScale(this.store.name);
        this.storeId = this.store._id;
        this.isPrivateMode(() => {}, this.recordTrack.bind(this));
        this.sharedStoreService.store.next(this.store);
        this.router.navigate([], { queryParams: {type: null, nav: null}, queryParamsHandling: 'merge' });
      } else {
        this.isShownSelection = false;
      }
      this.loading.stop();
    }, () => {
      this.loading.stop();
      this.isShownSelection = false;
    });
  }
  navigateToDetails() {
    this.isShownSelection = false;
  }
  navigateToItems() {
    this.isShownSelection = false;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.sharedStoreService.store.next(null);
  }
}
