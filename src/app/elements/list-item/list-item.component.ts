import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Item } from '@objects/item';
import { environment } from '@environments/environment';
import { CurrencyService } from '@services/http/general/currency.service';
import { Subject } from 'rxjs';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { takeUntil } from 'rxjs/operators';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

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
  ngUnsubscribe: Subject<any> = new Subject;
  followItems: Array<string> = [];
  constructor(
    private router: Router,
    public currencyService: CurrencyService,
    private sharedUserService: SharedUserService,
    private authFollowService: AuthFollowService) { 
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
    }
  }
  followClicked(event) {
    event.stopPropagation();
    if (this.follow) {
      this.authFollowService.unfollowItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result) {
          let followItems = _.filter(this.followItems, (id) => id != this.item._id);
          this.sharedUserService.followItems.next(followItems);
        }
      });
    } else {
      this.authFollowService.followItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result) {
          this.followItems.push(this.item._id)
          let followItems = _.uniq(this.followItems);
          this.sharedUserService.followItems.next(followItems);
        }
      });
    }
  }
  navigateItem(event) {
    event.stopPropagation();
    this.router.navigate(['', {outlets: {modal: 'item'}}], {queryParams: {item_id: this.item._id}, queryParamsHandling: 'merge'});
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
