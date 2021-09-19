import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { StoreService } from '@services/http/public/store.service';
import * as _ from 'lodash';
import { Store } from '@objects/store';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { AdvertisementService } from '@services/http/public/advertisement.service';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  environment = environment;
  total: number = 0;
  loading: WsLoading = new WsLoading;
  stores: Array<Store> = [];
  recommendedStores: Array<Store> = [];
  valueChanged = _.debounce(this.searchKeyword, 500);
  queryParams = {
    keyword: '',
    page: 1,
    order: 'name',
    orderBy: 'asc'
  }
  isMobileSize: boolean;
  squareAds = [];
  mediumAds = [];
  smallAds = [];
  displayAdvertisements = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    public advertisementService: AdvertisementService,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private storeService: StoreService) {
    let queryParams = this.route.snapshot.queryParams;
    this.queryParams = {
      keyword: queryParams['keyword'] || '',
      page: queryParams['page'] || 1,
      order: queryParams['order'],
      orderBy: queryParams['orderBy']
    }
    window.scrollTo(0, 0);
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
    if (this.queryParams.keyword) {
      DocumentHelper.setWindowTitleWithWonderScale(this.queryParams.keyword);
    } else {
      DocumentHelper.setWindowTitleWithWonderScale('Search');
    }
    this.getStoresByKeyword(this.queryParams);
    this.getAdvertisements();
    this.getRecommendedStores();
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.queryParams = {
        keyword: queryParams['keyword'] || '',
        page: queryParams['page'] || 1,
        order: queryParams['order'],
        orderBy: queryParams['orderBy']
      }
      if (this.queryParams.keyword) {
        DocumentHelper.setWindowTitleWithWonderScale(this.queryParams.keyword);
      } else {
        DocumentHelper.setWindowTitleWithWonderScale('Search');
      }
      this.getStoresByKeyword(this.queryParams);
    });
  }
  getStoresByKeyword({ keyword, page, order, orderBy }) {
    this.loading.start();
    this.storeService.getStoresByKeyword(keyword, page, order, orderBy).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.stores = result.result;
      this.total = result['total'];
    });
  }
  getAdvertisements() {
    this.advertisementService.getAdvertisements({types: ['square', 'medium', 'small']}).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.squareAds = this.advertisementService.getCurrentAdvertisement(result['squareAds'], result['currentNumber']);
      this.mediumAds = this.advertisementService.getCurrentAdvertisement(result['mediumAds'], result['currentNumber']);
      this.smallAds = this.advertisementService.getCurrentAdvertisement(result['smallAds'], result['currentNumber']);
      this.displayAdvertisements.push(...this.squareAds.slice(0, 1).map(x => x._id));
      this.displayAdvertisements.push(...this.mediumAds.slice(0, 1).map(x => x._id));
      this.displayAdvertisements.push(...this.smallAds.slice(0, 3).map(x => x._id));
      this.viewAdvertisements(this.displayAdvertisements);
    });
  }
  viewAdvertisements(ids) {
    this.advertisementService.viewAdvertisements(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
  }
  getRecommendedStores() {
    this.storeService.getRecommendedStores().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.recommendedStores = result.result;
    })
  }
  searchKeyword(event) {
    let value = event.target.value;
    this.navigateTo({ keyword: value });
  }
  navigateTo(obj) {
    obj = { ...this.queryParams, ...obj }
    this.router.navigate([], { queryParams: obj, queryParamsHandling: 'merge' });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
