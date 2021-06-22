import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import * as _ from 'lodash';
import { SharedUserService } from '@services/shared/shared-user.service';
import { debounceTime, delay, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject, Subscription, timer } from 'rxjs';
import { User } from '@objects/user';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { ScreenService } from '@services/general/screen.service';
import { VisitorGuard } from 'src/app/guards/visitor.guard';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthNotificationUserService } from '@services/http/auth/auth-notification-user.service';
import * as moment from 'moment';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  keyword: string = '';
  user: User;
  moment = moment;
  environment = environment;
  isNotificationDropdown: boolean;
  notificationLazyLoading: WsLoading = new WsLoading();
  notificationLoading: WsLoading = new WsLoading();
  updatedAt = new Date;
  notifications;
  checkNotificationSubscription;
  REFRESHER_NOTIFICATIONS_INTERVAL = 30 * 1000;
  numberOfNewNotifications: number;
  isMobileSize: boolean = null;
  private currentStream: Subscription;
  @ViewChild('headerKeyword') headerKeyword: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authUserService: AuthUserService,
    private sharedLoadingService: SharedLoadingService,
    private router: Router,
    private visitorGuard: VisitorGuard,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private authNotificationUserService: AuthNotificationUserService,
    private screenService: ScreenService,
    private sharedUserService: SharedUserService,
    private authFollowService: AuthFollowService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.user = result;
        if (result) {
          this.getFollowStores();
          this.getFollowItems();
          this.getNotifications();
          this.checkNotifications();
          // temp disable sse
          // this.setupNotificationStream();
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

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(queryParams => {
      let isModal = queryParams['modal'];
      if (isModal && this.isAuthenticateUrl(isModal)) {
        this.visitorGuard.canActivate().then(result => {
          if (result) {
            if (isModal == 'login') {
              this.createLazyLoginComponent();
            } else if (isModal == 'register') {
              this.createLazyRegisterComponent();
            } else if (isModal == 'forgot-password') {
              this.createLazyForgotPasswordComponent();
            } else if (isModal == 'activate') {
              this.createLazyActivateComponent();
            } else if (isModal == 'reset-password') {
              this.createLazyResetPasswordComponent();
            }
          } else {
            this.getUser();
            this.router.navigate([], {queryParams: {modal: null}});
          }
        })
      } else {
        this.viewContainerRef.clear();
      }
    })
  }
  isAuthenticateUrl(url) {
    return url =='login' || url == 'register' || url == 'forgot-password' || url == 'activate' || url == 'reset-password';
  }
  // temp disable sse
  // setupNotificationStream(delaySeconds=0) {
  //   if (this.currentStream) {
  //     this.currentStream.unsubscribe();
  //   }
  //   this.currentStream = of('init').pipe(delay(delaySeconds), switchMap(() => {
  //     return this.authNotificationUserService.getNotificationStream()
  //   }), switchMap((result) => {
  //     if (result['data'] === 'true') {
  //       return this.authNotificationUserService.getNotifications();
  //     }
  //     return of(null);
  //   }), takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     if (result) {
  //       this.notifications = [...result['result']];
  //       this.numberOfNewNotifications = result['meta']['isNewItem'];
  //     }
  //   }, err => {
  //     this.setupNotificationStream(30000);
  //   });
  // }
  checkNotifications() {
    if (this.checkNotificationSubscription) {
      this.checkNotificationSubscription.unsubscribe();
    }
    this.checkNotificationSubscription = timer(5000, this.REFRESHER_NOTIFICATIONS_INTERVAL).pipe(
      switchMap(() => {
        let obj = { updatedAt: this.updatedAt };
        return this.authNotificationUserService.checkNotifications(obj)}),
      takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result'] && result['result'].notification) {
        this.updatedAt = result['result'].notification;
        this.getNotifications();
      }
    }, err => {
      this.checkNotifications();
    });
  }
  async createLazyLoginComponent() {
    this.viewContainerRef.clear();
    await import ('../../../modules/authentication/login/login.module');
    const { LoginComponent } = await import('@components/feature/authentication/login/login.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(LoginComponent));
  }
  async createLazyRegisterComponent() {
    this.viewContainerRef.clear();
    await import('../../../modules/authentication/register/register.module');
    const { RegisterComponent } = await import('@components/feature/authentication/register/register.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(RegisterComponent));
  }
  async createLazyForgotPasswordComponent() {
    this.viewContainerRef.clear();
    await import('../../../modules/authentication/forgot-password/forgot-password.module');
    const { ForgotPasswordComponent } = await import('@components/feature/authentication/forgot-password/forgot-password.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ForgotPasswordComponent));
  }
  async createLazyActivateComponent() {
    this.viewContainerRef.clear();
    await import('../../../modules/authentication/activate/activate.module');
    const { ActivateComponent } = await import('@components/feature/authentication/activate/activate.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ActivateComponent));
  }
  async createLazyResetPasswordComponent() {
    this.viewContainerRef.clear();
    await import('../../../modules/authentication/reset-password/reset-password.module');
    const { ResetPasswordComponent } = await import('@components/feature/authentication/reset-password/reset-password.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ResetPasswordComponent));
  }
  getUser() {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if(result) {
          this.sharedUserService.user.next(result.result);
        }
      })
  }
  getFollowStores() {
    this.authFollowService.getFollowStoresIds().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.sharedUserService.followStores.next(result['result']);
    })
  }
  getFollowItems() {
    this.authFollowService.getFollowItemsIds().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.sharedUserService.followItems.next(result['result']);
    })
  }
  openNotificationDropdown() {
    this.isNotificationDropdown = true;
    this.getNotifications();
  }
  getNotifications(event?) {
    if (event) {
      this.notificationLazyLoading.start();
      this.authNotificationUserService.getNotifications().pipe(debounceTime(500), takeUntil(this.ngUnsubscribe), finalize(() => this.notificationLazyLoading.stop())).subscribe(result => {
        this.notifications = [...result['result']];
        this.numberOfNewNotifications = result['meta']['isNewItem'];
      });
    } 
    if (event === undefined) {
      this.notificationLoading.start();
      this.authNotificationUserService.getNotifications().pipe(debounceTime(500), takeUntil(this.ngUnsubscribe), finalize(() => this.notificationLoading.stop())).subscribe(result => {
        this.notifications = [...result['result']];
        this.numberOfNewNotifications = result['meta']['isNewItem'];
      });
    }
  }
  loadedNewNotifications() {
    if (this.isNotificationDropdown) {
      this.isNotificationDropdown = false;
      let notifications = this.notifications.filter(result => {
        return result['isNewItem'];
      }).map(result => {
        return result['_id'];
      });
      this.authNotificationUserService.loadedNewNotifications(notifications).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.numberOfNewNotifications = 0;
      });
    }
  }
  navigateToInvoice(notification) {
    this.loadedNewNotifications();
    this.isNotificationDropdown = false;
    this.authNotificationUserService.readNotification(notification?._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      notification.isRead = true;
    });
    this.router.navigate(['/invoice'], { queryParams: {s_id: notification?.data?.invoiceId, r_id: notification?.data?.receiptId }});
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
        if (this.checkNotificationSubscription) {
          this.checkNotificationSubscription.unsubscribe();
        }
      }, 500);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}