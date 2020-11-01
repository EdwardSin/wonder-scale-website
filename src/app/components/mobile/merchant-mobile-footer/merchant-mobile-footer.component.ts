import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@objects/store';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { SharedStoreService } from '@services/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'merchant-mobile-footer',
  templateUrl: './merchant-mobile-footer.component.html',
  styleUrls: ['./merchant-mobile-footer.component.scss']
})
export class MerchantMobileFooterComponent implements OnInit {
  store: Store;
  selectedNav: string;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    public authFollowService: AuthFollowService,
    public sharedUserService: SharedUserService,
    private route: ActivatedRoute,
    private router: Router) {
    this.selectedNav = this.route.snapshot.children[0].routeConfig.path;
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
    });
  }

  ngOnInit(): void {
  }
  navigateToInfo() {
    this.selectedNav = 'info';
    this.router.navigate(['/page/mobile/' + this.store.username + '/info'], { queryParamsHandling: 'merge' });
  }
  navigateToMenu() {
    this.selectedNav = 'menu';
    this.router.navigate(['/page/mobile/' + this.store.username + '/menu'], { queryParamsHandling: 'merge' });
  }
  navigateToShare() {
    this.selectedNav = 'share';
    this.router.navigate(['/page/mobile/' + this.store.username + '/share'], { queryParamsHandling: 'merge' });
  }
  getLinkActive(): string {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl = queryParamsIndex === -1 ? this.router.url : this.router.url.slice(0, queryParamsIndex);
    return decodeURIComponent(baseUrl);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
