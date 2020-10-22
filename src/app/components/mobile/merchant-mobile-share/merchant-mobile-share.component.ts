import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@objects/store';
import { SharedStoreService } from '@services/shared-store.service';
import { FacebookService, InitParams } from 'ngx-facebook';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'merchant-mobile-share',
  templateUrl: './merchant-mobile-share.component.html',
  styleUrls: ['./merchant-mobile-share.component.scss']
})
export class MerchantMobileShareComponent implements OnInit {
  store: Store;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    public facebookService: FacebookService) { 
      this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.store = result;
      });
      
      let initParams: InitParams = {
        appId: environment.FACEBOOK_APP_ID,
        xfbml: true,
        version: 'v2.8'
      };
      this.facebookService.init(initParams);
    }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
