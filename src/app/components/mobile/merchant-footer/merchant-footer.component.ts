import { Component, OnInit, Input } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Router } from '@angular/router';
import { SharedStoreService } from '@services/shared-store.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { Store } from '@objects/store';
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
  store: Store;
  followStores: Array<string> = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private authFollowService: AuthFollowService,
    private sharedUserService: SharedUserService,
    private sharedStoreService: SharedStoreService) { }

  ngOnInit(): void {
    this.loading.start();
    this.saveLoading.start();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        this.isFollowedStore();
        this.loading.stop();
      }
    });
  }
  isFollowedStore() {
    this.authFollowService.isFollowedStore(this.store._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.saved = result['result'];
      this.saveLoading.stop();
    })
  }
  saveStore() {
    if (!this.saveLoading.isRunning()) {
      this.saveLoading.start();
      combineLatest(timer(500),
        this.authFollowService.followStore(this.store._id))
        .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
          this.saved = result['result'];
          this.followStores.push(this.store._id)
          let followStores = _.uniq(this.followStores);
          this.sharedUserService.followStores.next(followStores);
          this.saveLoading.stop();
        });
    }
  }
  unsaveStore() {
    if (!this.saveLoading.isRunning()) {
      this.saveLoading.start();
      combineLatest(timer(500),
        this.authFollowService.unfollowStore(this.store._id))
        .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
          this.saved = result['result'];
          let followStores = _.filter(this.followStores, (id) => id != this.store._id);
          this.sharedUserService.followStores.next(followStores);
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
