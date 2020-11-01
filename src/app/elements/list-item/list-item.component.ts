import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Item } from '@objects/item';
import { environment } from '@environments/environment';
import { CurrencyService } from '@services/http/general/currency.service';
import { Subject } from 'rxjs';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { takeUntil } from 'rxjs/operators';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: number;
  @Input() savable: boolean = true;
  @Input() removable: boolean;
  @Input() follow: boolean;
  @Output() followChanged: EventEmitter<any> = new EventEmitter;
  environment = environment;
  saveLoading: WsLoading = new WsLoading;
  ngUnsubscribe: Subject<any> = new Subject;
  followItems: Array<string> = [];
  isAuthenticated: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    public currencyService: CurrencyService,
    private sharedUserService: SharedUserService,
    private authFollowService: AuthFollowService) { 
      this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParams => {
        if (queryParams['modal'] && queryParams['modal'] == 'item' &&
        queryParams['item_id'] && this.item && queryParams['item_id'] == this.item._id) {
            this.createLazyItemInfoComponent();
        }
        else {
          this.viewContainerRef.clear();
        }
      })
      this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.isAuthenticated = !!result;
      });
    }

  ngOnInit(): void {
    this.sharedUserService.followItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.followItems = result;
      if (this.item) {
        this.follow = this.followItems.includes(this.item._id);
      }
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      this.follow = this.followItems.includes(this.item._id);
      this.item.isDiscountExisting = this.item.isOffer && (this.item.types.find(type => type.discount > 0) != null || this.item.discount > 0);
      let queryParams = this.route.snapshot.queryParams;
      if (queryParams['modal'] && queryParams['modal'] == 'item' && queryParams['item_id'] && this.item && queryParams['item_id'] == this.item._id) {
        this.createLazyItemInfoComponent();
      }
    }
  }
  followClicked(event) {
    event.stopPropagation();
    this.saveLoading.start();
    if (this.follow) {
      this.authFollowService.unfollowItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.saveLoading.stop();
        if (result) {
          let followItems = _.filter(this.followItems, (id) => id != this.item._id);
          this.sharedUserService.followItems.next(followItems);
        }
      });
    } else {
      this.authFollowService.followItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.saveLoading.stop();
        if (result) {
          this.followItems.push(this.item._id)
          let followItems = _.uniq(this.followItems);
          this.sharedUserService.followItems.next(followItems);
        }
      });
    }
  }
  async createLazyItemInfoComponent() {
    this.viewContainerRef.clear();
    await import('../../modules/list-item-info/list-item-info.module');
    const { ListItemInfoComponent } = await import('@components/list-item-info/list-item-info.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ListItemInfoComponent));
  }
  navigateItem(event) {
    event.stopPropagation();
    this.router.navigate([], {queryParams: {item_id: this.item._id, modal: 'item'}, queryParamsHandling: 'merge'});
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
