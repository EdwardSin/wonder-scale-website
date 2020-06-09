import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { ShopService } from '@services/http/public/shop.service';
import * as _ from 'lodash';
import { Shop } from '@objects/shop';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  environment = environment;
  total: number = 0;
  loading: WsLoading = new WsLoading;
  shops: Array<Shop> = [];
  recommandedShops: Array<Shop> = [];
  valueChanged = _.debounce(this.searchKeyword, 500);
  queryParams = {
    keyword: '',
    page: 1,
    order: 'name',
    orderBy: 'asc'
  }
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService) {
    let queryParams = this.route.snapshot.queryParams;
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
    this.getShopsByKeyword(this.queryParams);
    this.getRecommandedShops();
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
      this.getShopsByKeyword(this.queryParams);
    });
  }
  getShopsByKeyword({ keyword, page, order, orderBy }) {
    this.loading.start();
    this.shopService.getShopsByKeyword(keyword, page, order, orderBy).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.shops = result.result;
      this.total = result['total'];
    });
  }
  getRecommandedShops() {
    this.shopService.getRecommandedShops().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.recommandedShops = result.result;
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
