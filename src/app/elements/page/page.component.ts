import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Shop } from '@objects/shop';
import { environment} from '@environments/environment';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, timer, combineLatest } from 'rxjs';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  @Input() item: Shop;
  @Input() index: number;
  @Input() savable: boolean = true;
  @Input() removable: boolean;
  @Input() follow: boolean;
  @Output() followChanged: EventEmitter<any> = new EventEmitter; 
  private ngUnsubscribe: Subject<any> = new Subject;
  followPages: Array<string> = [];
  environment = environment;
  constructor(private authFollowService: AuthFollowService,
    private sharedUserService: SharedUserService) { }

  ngOnInit(): void {
    this.sharedUserService.followPages.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.followPages = result;
      if (this.item) {
        this.follow = this.followPages.includes(this.item._id);
      }
    })
  }
  followClicked(event) {
    event.stopPropagation();
    if(this.follow) {
      this.unsaveShop();
    } else {
      this.saveShop();
    }
  }
  removeFollow() {
    this.authFollowService.unfollowShop(this.item._id).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.followChanged.emit(true);
    });
  }
  saveShop() {
    combineLatest(timer(500),
    this.authFollowService.followShop(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.followPages.push(this.item._id)
      let followPages = _.uniq(this.followPages);
      this.sharedUserService.followPages.next(followPages);
    });
  }
  unsaveShop() {
    combineLatest(timer(500),
    this.authFollowService.unfollowShop(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      let followPages = _.filter(this.followPages, (id) => id != this.item._id);
      this.sharedUserService.followPages.next(followPages);
    });
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
