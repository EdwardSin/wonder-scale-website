import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { Subject, combineLatest, timer } from 'rxjs';
import { takeUntil, finalize, map, take } from 'rxjs/operators';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { environment } from '@environments/environment';
import { MapController, MapCircle } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { ScreenService } from '@services/general/screen.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  displayItems = [];
  displayModalItems = [];
  mapController: MapController;

  loading: WsLoading = new WsLoading;
  modalLoading: WsLoading = new WsLoading;
  selected: string = 'page';
  isFavoriteModalOpened: boolean;
  moment = moment;
  environment = environment;
  modalType: string = 'page';
  modalTotal: number = 0;
  modalCurrentPage: number = 1;
  isMobileMapShown: boolean;
  temp = {
    latitude: 0,
    longitude: 0
  }
  queryParams: any = {
    selected: '',
    keyword: '',
    page: 1
  };
  selectedPage;
  valueChanged = _.debounce(this.searchKeyword, 500);
  total: number = 0;
  isMobileSize: boolean;
  rendered: boolean;
  isFavoriteModalHidden: boolean = true;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private route: ActivatedRoute, 
    private router: Router,
    private ref: ChangeDetectorRef,
    private gpsService: WsGpsService,
    private screenService: ScreenService,
    private authFollowService: AuthFollowService) { 
      window.scrollTo(0, 0);
      this.mapController = new MapController(gpsService);
    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          let item_id = this.queryParams.item_id;
          if (!item_id && !this.isEqualParams(this.queryParams, this.route.snapshot.queryParams)) {
            this.queryParams = this.route.snapshot.queryParams;
            if (this.isFavoriteModalHidden) {
              this.queryParams = {
                            selected: this.queryParams['selected'] || 'page',
                            keyword: this.queryParams['keyword'] || '',
                            page: this.queryParams['page'] || 1}
              this.selected = this.queryParams['selected'];
              if (this.selected == 'page') {
                this.getFollowShops(this.queryParams);
              } else if (this.selected == 'item') {
                this.getFollowItems(this.queryParams);
              }
              DocumentHelper.setWindowTitleWithWonderScale('Favorite ' + this.selected);
            }
            this.isFavoriteModalOpened = this.route.snapshot.queryParams['modal'] == 'true';
            if (typeof(sessionStorage) !== undefined) {
              let favoriteSearchingCache = JSON.parse(sessionStorage.getItem('favoriteSearchingCache'));
              if (favoriteSearchingCache && this.isFavoriteModalOpened) {
                this.modalType = favoriteSearchingCache.type;
                this.mapController.zoom = favoriteSearchingCache.zoom;
                this.mapController.mapPoint = { latitude: favoriteSearchingCache.latitude, longitude: favoriteSearchingCache.longitude };
                this.mapController.mapCircle.latitude = favoriteSearchingCache.latitude;
                this.mapController.mapCircle.longitude = favoriteSearchingCache.longitude;
              } else {
                sessionStorage.removeItem('favoriteSearchingCache');
              }
              this.getCurrentPosition();
            }
          }
        }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  ngOnInit(): void {
  }
  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let favoriteSearchingCache = JSON.parse(sessionStorage.getItem('favoriteSearchingCache'));
        let {latitude, longitude} = position.coords;
        this.mapController.currentPoint = { latitude, longitude };
        if (!favoriteSearchingCache || !favoriteSearchingCache.latitude || !favoriteSearchingCache.longitude) {
          this.mapController.mapPoint = { latitude, longitude };
          this.mapController.mapCircle.latitude = latitude;
          this.mapController.mapCircle.longitude = longitude;
        }
      });
    } 
  }
  isEqualParams(queryParams, latestQueryParams) {
    return queryParams.selected == latestQueryParams.selected &&
          queryParams.keyword == latestQueryParams.keyword &&
          queryParams.page + '' == latestQueryParams.page;
  }
  navigateTo(obj) {
    obj = {...this.queryParams, ...obj}
    this.router.navigate([], {queryParams: obj, queryParamsHandling: 'merge'});
  }
  searchKeyword(event) {
    let value = event.target.value;
    this.navigateTo({keyword: value});
  }
  getFollowShops({keyword, page, order, orderBy}, loading=true) {
    if (loading) {
      this.loading.start();
    }
      this.authFollowService.getFollowShops(keyword, page, order, orderBy)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (page > 1 && !result.result.length) {
        this.navigateTo({page: 1});
      } else {
        this.displayItems = result.result;
        this.total = result['total'];
      }
      setTimeout(() => {this.loading.stop()}, 500);
    });
  }
  getFollowItems({keyword, page, order, orderBy}, loading=true) {
    if (loading) {
      this.loading.start();
    }
    this.authFollowService.getFollowItems(keyword, page, order, orderBy)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (page > 1 && !result.result.length) {
        this.navigateTo({page: 1});
      } else {
        this.displayItems = result.result;
        this.total = result['total'];
      }
      setTimeout(() => {this.loading.stop()}, 500);
    });
  }
  getFollowShopsByPosition({keyword, page, order, orderBy, latitude, longitude, radius}) {
    this.modalLoading.start();
    this.authFollowService.getFollowShopsByPosition(keyword, page, order, orderBy, latitude, longitude, radius)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.displayModalItems = result.result;
      this.modalTotal = result['total'];
      _.delay(() => {
        this.modalLoading.stop();
        this.ref.detectChanges();
      }, 500);
    });
  }
  getFollowItemsByPosition({keyword, page, order, orderBy, latitude, longitude, radius}) {
    this.modalLoading.start();
    this.authFollowService.getFollowItemsByPosition(keyword, page, order, orderBy, latitude, longitude, radius)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.displayModalItems = result.result;
      this.modalTotal = result['total'];
      _.delay(() => {
        this.modalLoading.stop();
        this.ref.detectChanges();
      }, 500);
    });
  }
  onFavoriteModalOpened(event) {
    if (event) {
      this.navigateTo({modal: true});
      _.delay(() => {
        this.updateModalItems();
      }, 1000);
    } else {
      this.navigateTo({modal: null});
      this.isFavoriteModalHidden = true;
      this.isMobileMapShown = false;
      if (typeof sessionStorage !== undefined) {
        sessionStorage.removeItem('favoriteSearchingCache');
      }
    }
  }
  updateModalItems() {
    let params = { keyword: '', page: this.modalCurrentPage, order: 'name', orderBy: 'asc', 
    latitude: this.mapController.mapCircle.latitude, 
    longitude: this.mapController.mapCircle.longitude,
    radius: this.mapController.mapCircle.radius
    };
    if(typeof (sessionStorage) !== undefined) {
      sessionStorage.setItem('favoriteSearchingCache', 
      JSON.stringify({
        location: this.mapController.address.address,
        type: this.modalType,
        longitude: params.longitude,
        latitude: params.latitude,
        zoom: this.mapController.zoom
      }));
    }
    if (this.modalType == 'page') {
      this.getFollowShopsByPosition(params);
    } else {
      this.getFollowItemsByPosition(params);
    }
  }
  changePaged(event) {
    if (this.modalCurrentPage != event && this.modalCurrentPage) {
      this.modalCurrentPage = event;
      setTimeout(() => {
        this.updateModalItems();
      });
    }
  }
  followShopChanged() {
    this.getFollowShops(this.queryParams, false);
  }
  followItemChanged() {
    this.getFollowItems(this.queryParams, false);
  }
  centerChange(event) {
    this.temp.latitude = event.lat;
    this.temp.longitude = event.lng;
  }
  zoomChange(event) {
    this.mapController.zoom = event;
  }
  selectMarker(result) {
    this.selectedPage = result;
  }
  onAddressSelected() {
    this.mapController.onAddressSelected().then(() => {
      this.updateModalItems();
    });
    this.mapController.displayed = false;
  }
  mapReady(map) {
    map.addListener('dragend', () => {
      this.mapController.mapCircle.latitude = this.temp.latitude;
      this.mapController.mapCircle.longitude = this.temp.longitude;
      this.mapController.mapPoint.latitude = this.temp.latitude;
      this.mapController.mapPoint.longitude = this.temp.longitude;
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}