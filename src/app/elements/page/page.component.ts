import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Shop } from '@objects/shop';
import { environment} from '@environments/environment';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, timer, combineLatest } from 'rxjs';

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
  environment = environment;
  constructor(private authFollowService: AuthFollowService) { }

  ngOnInit(): void {
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
      this.follow = result['result'];
    });
  }
  unsaveShop() {
    combineLatest(timer(500),
    this.authFollowService.unfollowShop(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.follow = result['result'];
    });
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
