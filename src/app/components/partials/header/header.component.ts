import { Component, OnInit, HostListener, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { SharedUserService } from '@services/shared/shared-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '@objects/user';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { Router } from '@angular/router';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  didScroll: boolean;
  isShrink: boolean;
  changeHeaderOn: number = 200;
  keyword: string = '';
  user: User;
  isMobileSize: boolean;
  @ViewChild('headerKeyword') headerKeyword: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authUserService: AuthUserService,
    private sharedLoadingService: SharedLoadingService,
    private router: Router,
    private screenService: ScreenService,
    private sharedUserService: SharedUserService,
    private authFollowService: AuthFollowService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.user = result;
        if (result) {
          this.getFavoriteItems();
        }
      })
    this.authenticationService.isAuthenticated().then(result => {
      if (result) {
        this.getUser();
      }
    })
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isMobileSize = result;
    })
  }

  @HostListener('window:scroll', ['$event'])
  
  onScrollDown(event) {
    if (!this.didScroll){
      this.didScroll = true;
      setTimeout(() => {
        this.scrollPage()
      }, 300);
    }
  }
  scrollPage() {
    var sy = this.scrollY();
    this.isShrink = sy >= this.changeHeaderOn;
		this.didScroll = false;
  }
  scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
  getUser() {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if(result) {
          this.sharedUserService.user.next(result.result);
        }
      })
  }
  getFavoriteItems() {
    this.authFollowService.getFollowItemsIds().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.sharedUserService.favoriteItems.next(result.result);
    })
  }
  navigateTo() {
    this.headerKeyword.nativeElement.blur();
    this.router.navigate(['/search'], {queryParams: {keyword: this.keyword}});
  }
  logout() {
    this.sharedLoadingService.screenLoading.next({loading: true, label: 'Logging out...'});
    this.authenticationService.logout().then(result => {
      setTimeout(() => {
        this.sharedLoadingService.screenLoading.next({loading: false});
        this.router.navigate(['']);
      }, 500);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}