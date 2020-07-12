import { Component, OnInit, Input } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Router } from '@angular/router';
import { SharedShopService } from '@services/shared-shop.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { Shop } from '@objects/shop';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';

@Component({
  selector: 'merchant-footer',
  templateUrl: './merchant-footer.component.html',
  styleUrls: ['./merchant-footer.component.scss']
})
export class MerchantFooterComponent implements OnInit {
  @Input() element;
  loading: WsLoading = new WsLoading;
  saveLoading: WsLoading = new WsLoading;
  saved: boolean;
  shop: Shop;
  followPages: Array<string> = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private authFollowService: AuthFollowService,
    private sharedUserService: SharedUserService,
    private sharedShopService: SharedShopService) { }

  ngOnInit(): void {
    this.loading.start();
    this.saveLoading.start();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.shop = result;
        this.isFollowedShop();
        this.loading.stop();
      }
    });
  }
  isFollowedShop() {
    this.authFollowService.isFollowedShop(this.shop._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.saved = result['result'];
      this.saveLoading.stop();
    })
  }
  saveShop() {
    if (!this.saveLoading.isRunning()) {
      this.saveLoading.start();
      combineLatest(timer(500),
        this.authFollowService.followShop(this.shop._id))
        .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
          this.saved = result['result'];
          this.followPages.push(this.shop._id)
          let followPages = _.uniq(this.followPages);
          this.sharedUserService.followPages.next(followPages);
          this.saveLoading.stop();
        });
    }
  }
  unsaveShop() {
    if (!this.saveLoading.isRunning()) {
      this.saveLoading.start();
      combineLatest(timer(500),
        this.authFollowService.unfollowShop(this.shop._id))
        .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
          this.saved = result['result'];
          let followPages = _.filter(this.followPages, (id) => id != this.shop._id);
          this.sharedUserService.followPages.next(followPages);
          this.saveLoading.stop();
        });
    }
  }
  isLinkActive(url): boolean {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl = queryParamsIndex === -1 ? this.router.url : this.router.url.slice(0, queryParamsIndex);
    return decodeURIComponent(baseUrl) === url;
  }
}
