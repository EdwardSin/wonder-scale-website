import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from 'src/app/objects/store';
import { finalize, takeUntil, tap } from 'rxjs/operators';
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
import { Meta } from '@angular/platform-browser';
import { DateTimeHelper } from '../../helpers/datetimehelper/datetime.helper';
import { isPlatformBrowser } from '@angular/common';
import { ReviewService } from '@services/http/public/review.service';

@Component({
  selector: 'merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  loading: WsLoading = new WsLoading;
  store: Store;
  totalOfReviews: Number = 0;
  banners: Array<string> = [];
  menuImages: Array<string> = [];
  profileImage: string;
  
  DEBOUNCE_TRACK_VALUE = 15 * 1000;
  trackId;
  isAuthenticated: boolean;
  isSaveLoading: WsLoading = new WsLoading;
  isQrcodeLoading: WsLoading = new WsLoading;
  displayImage: string = '';
  selectedNavItem = 'overview';
  isFollowed: boolean;
  todayDate;
  platform;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private storeService: StoreService,
    public reviewService: ReviewService,
    private sharedUserService: SharedUserService,
    private sharedStoreService: SharedStoreService,
    private trackService: TrackService,
    private meta: Meta,
    public authFollowService: AuthFollowService,
    public facebookService: FacebookService,
    public itemService: ItemService,
    @Inject(PLATFORM_ID) private platformId) {
    this.todayDate = DateTimeHelper.getTodayWithCurrentTimezone()
  }
  ngOnInit() {
    this.platform = isPlatformBrowser(this.platformId);
    let username = this.route.snapshot.params.username;
    let isMobileDevice = this.screenService.isMobileDevice.value;
    let nav = this.route.snapshot.queryParams.nav || this.selectedNavItem;
    this.selectedNavItem = nav;
    this.loading.start();
    if (isMobileDevice) {
      if (!this.router.url.includes('/page/mobile/')) {
        this.router.navigate(['/page', 'mobile', username], {queryParamsHandling: 'merge' });
      }
    } else if (this.platform) {
      this.getStoreByUsername(username);
    }
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isAuthenticated = !!result;
    });

    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.store && this.platform) {
            DocumentHelper.setWindowTitleWithWonderScale(this.store.name);
          }
        }
      });
  }
  getStoreByUsername(username) {
    this.storeService.getStoreByUsername(username).pipe(tap((result) => {
      this.store = result.result;
      this.authFollowService.isFollowedStore(this.store._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.isFollowed = result['result'];
        this.isSaveLoading.stop();
      })
    }), takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(() => {
      if (this.store) {
        this.sharedStoreService.store.next(this.store);
        this.banners = this.store.informationImages.map(informationImage => environment.IMAGE_URL + informationImage);
        this.menuImages = this.store.menuImages.map(menuImage => environment.IMAGE_URL + menuImage);

        // this.profileImage = this.store.profileImage ? environment.IMAGE_URL + this.store.profileImage: null;
        this.banners = [
          '/assets/images/extra/bagel_01.jpg',
          '/assets/images/extra/bagel_02.jpg',
          '/assets/images/extra/bagel_03.jpg',
          '/assets/images/extra/bagel_04.jpg',
          '/assets/images/extra/bagel_05.jpg',
          '/assets/images/extra/bagel_06.jpg'
        ];
        this.menuImages = [
          '/assets/images/extra/chips_01.jpg',
          '/assets/images/extra/chips_02.jpg',
          '/assets/images/extra/chips_03.jpg'
        ];
        this.profileImage = '/assets/images/extra/icon.jpg';
        if (this.platform) {
          DocumentHelper.setWindowTitleWithWonderScale(this.store.name);
        }
        this.meta.updateTag({ name: 'title', content: this.store.name });
        this.meta.updateTag({ name: 'description', content: this.store.description });
        if (this.platform) {
          this.isPrivateMode(() => {}, this.recordTrack.bind(this));
        }
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
    let isNotToday = DateTimeHelper.getDateWithCurrentTimezone(new Date(previousTrack.date)).valueOf() != this.todayDate.valueOf();
    let isNotIncludeStore = typeof previousTrack.value == typeof [] && !previousTrack.value.includes(this.store._id)
    isTrackable = isNotToday || isNotIncludeStore;
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
