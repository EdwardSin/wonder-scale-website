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
  selectedSize = 45;
  valueChanged = _.debounce(this.searchKeyword, 500);
  total: number = 0;
  isMobileSize: boolean;
  rendered: boolean;
  previousState: string = '';
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
    this.setupFavorite();
    this.setupLocationModal();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      if (!queryParams['modal'] && this.isFavoriteModalHidden && this.previousState != 'location'
        && this.previousState != 'item') {
        this.setupFavorite();
        DocumentHelper.setWindowTitleWithWonderScale('Favorite ' + this.selected);
      }
      if (queryParams['modal'] && queryParams['modal'] == 'location') {
        this.previousState = 'location';
        this.isFavoriteModalHidden = false;
        this.setupLocationModal();
      }
      if (queryParams['modal']) {
        this.previousState = queryParams['modal'];
      }
      if (!queryParams['modal']) {
        this.previousState = '';
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  ngOnInit(): void {
  }
  setupFavorite() {
    let queryParams = this.route.snapshot.queryParams;
    this.queryParams = {
      selected: queryParams['selected'] || 'page',
      keyword: queryParams['keyword'] || '',
      page: queryParams['page'] || 1
    }
    this.selected = this.queryParams['selected'];
    if (this.selected == 'page') {
      this.getFollowShops(this.queryParams);
    } else if (this.selected == 'item') {
      this.getFollowItems(this.queryParams);
    }
  }
  setupLocationModal() {
    let queryParams = this.route.snapshot.queryParams;
    if (queryParams['modal'] == 'location') {
      this.isFavoriteModalOpened = queryParams['modal'] == 'location';
      if (typeof (sessionStorage) !== undefined) {
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
  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let favoriteSearchingCache = JSON.parse(sessionStorage.getItem('favoriteSearchingCache'));
        let { latitude, longitude } = position.coords;
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
    obj = { ...this.queryParams, ...obj }
    this.router.navigate([], { queryParams: obj, queryParamsHandling: 'merge' });
  }
  searchKeyword(event) {
    let value = event.target.value;
    this.navigateTo({ keyword: value });
  }
  getFollowShops({ keyword, page, order, orderBy }, loading = true) {
    if (loading) {
      this.loading.start();
    }
    this.authFollowService.getFollowShops(keyword, page, order, orderBy)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (page > 1 && !result.result.length) {
          this.navigateTo({ page: 1 });
        } else {
          this.displayItems = result.result;
          this.total = result['total'];
        }
        setTimeout(() => { this.loading.stop() }, 500);
      });
  }
  getFollowItems({ keyword, page, order, orderBy }, loading = true) {
    if (loading) {
      this.loading.start();
    }
    this.authFollowService.getFollowItems(keyword, page, order, orderBy)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (page > 1 && !result.result.length) {
          this.navigateTo({ page: 1 });
        } else {
          this.displayItems = result.result;
          this.total = result['total'];
        }
        setTimeout(() => { this.loading.stop() }, 500);
      });
  }
  getFollowShopsByPosition({ keyword, page, order, orderBy, latitude, longitude, radius }) {
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
  getFollowItemsByPosition({ keyword, page, order, orderBy, latitude, longitude, radius }) {
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
      this.navigateTo({ modal: 'location' });
      _.delay(() => {
        this.updateModalItems();
      }, 1000);
    } else {
      this.navigateTo({ modal: null });
      this.isFavoriteModalHidden = true;
      this.isMobileMapShown = false;
      if (typeof sessionStorage !== undefined) {
        sessionStorage.removeItem('favoriteSearchingCache');
      }
    }
  }
  updateModalItems() {
    let params = {
      keyword: '', page: this.modalCurrentPage, order: 'name', orderBy: 'asc',
      latitude: this.mapController.mapCircle.latitude,
      longitude: this.mapController.mapCircle.longitude,
      radius: this.mapController.mapCircle.radius
    };
    if (typeof (sessionStorage) !== undefined) {
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
    this.selectedSize = 70;
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