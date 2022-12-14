import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Item } from '@objects/item';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { takeUntil } from 'rxjs/operators';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
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
    private sharedUserService: SharedUserService,
    private authFollowService: AuthFollowService) { 
      this.sharedUserService.followItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.followItems = result;
        if (this.item) {
          this.follow = this.followItems.includes(this.item._id);
        }
      })
    }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      this.follow = this.followItems.includes(this.item._id);
    }
  }
  removeFollow() {
    this.authFollowService.unfollowItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      let followItems = _.filter(this.followItems, (id) => id != this.item._id);
      this.sharedUserService.followItems.next(followItems);
      this.followChanged.emit(true);
    });
  }
  followClicked() {
    if (this.follow) {
      this.authFollowService.unfollowItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        let followItems = _.filter(this.followItems, (id) => id != this.item._id);
        this.sharedUserService.followItems.next(followItems);
      });
    } else {
      this.authFollowService.followItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.followItems.push(this.item._id)
        let followItems = _.uniq(this.followItems);
        this.sharedUserService.followItems.next(followItems);
      });
    }
  }
  
}
