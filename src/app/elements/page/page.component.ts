import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '@objects/store';
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
  @Input() item: Store;
  @Input() index: number;
  @Input() savable: boolean = true;
  @Input() removable: boolean;
  @Input() follow: boolean;
  @Output() followChanged: EventEmitter<any> = new EventEmitter; 
  private ngUnsubscribe: Subject<any> = new Subject;
  followStores: Array<string> = [];
  environment = environment;
  constructor(private authFollowService: AuthFollowService,
    private sharedUserService: SharedUserService) { }

  ngOnInit(): void {
    this.sharedUserService.followStores.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.followStores = result;
      if (this.item) {
        this.follow = this.followStores.includes(this.item._id);
      }
    })
  }
  followClicked(event) {
    event.stopPropagation();
    if(this.follow) {
      this.unsaveStore();
    } else {
      this.saveStore();
    }
  }
  removeFollow() {
    this.authFollowService.unfollowStore(this.item._id).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.followChanged.emit(true);
      let followStores = _.filter(this.followStores, (id) => id != this.item._id);
      this.sharedUserService.followStores.next(followStores);
    });
  }
  saveStore() {
    combineLatest(timer(500),
    this.authFollowService.followStore(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.followStores.push(this.item._id)
        let followStores = _.uniq(this.followStores);
        this.sharedUserService.followStores.next(followStores);
      }
    });
  }
  unsaveStore() {
    combineLatest(timer(500),
    this.authFollowService.unfollowStore(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        let followStores = _.filter(this.followStores, (id) => id != this.item._id);
        this.sharedUserService.followStores.next(followStores);
      }
    });
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
