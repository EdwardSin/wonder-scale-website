import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { Store } from '@objects/store';
import * as _ from 'lodash';

@Component({
  selector: 'merchant-footer',
  templateUrl: './merchant-footer.component.html',
  styleUrls: ['./merchant-footer.component.scss']
})
export class MerchantFooterComponent implements OnInit {
  @Input() store: Store;
  @Input() isEditing: boolean;
  @Input() selectedNav: string;
  @Input() navigateToInfo;
  @Input() navigateToMenu;
  @Input() navigateToShare;
  @Input() authFollowService;
  @Input() sharedUserService;
  loading: WsLoading = new WsLoading;
  saveLoading: WsLoading = new WsLoading;
  saved: boolean;
  followStores: Array<string> = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['store'] && this.store) {
      if (this.authFollowService) {
        this.saveLoading.start();
        this.isFollowedStore();
      }
    }
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
}
