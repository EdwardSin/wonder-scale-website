import { Component, OnInit } from '@angular/core';
import { SharedShopService } from '@services/shared-shop.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Shop } from '@objects/shop';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { environment } from '@environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'merchant-info',
  templateUrl: './merchant-info.component.html',
  styleUrls: ['./merchant-info.component.scss']
})
export class MerchantInfoComponent implements OnInit {
  environment = environment;
  shop: Shop;
  message;
  medias;
  preview: boolean;
  isShownLocation: boolean;
  isInformationOpened: boolean = false;
  selectedInformationIndex: number = 0;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private sharedShopService: SharedShopService) {
  }

  ngOnInit(): void {
    this.loading.start();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.shop = result;
        if (this.shop.media && this.shop.media.length) {
          this.medias = _.groupBy(this.shop.media, 'type');
        }
        if (this.shop.showAddress && this.shop['location'] && this.shop['location']['coordinates']) {
          this.isShownLocation = this.shop['location']['coordinates'][0] != 0 && this.shop['location']['coordinates'][1] != 0;
        }
        this.loading.stop();
      }
    })
  }
  openInformation(index) {
    this.isInformationOpened = true;
    this.selectedInformationIndex = index;
  }
  closeAlert() {
    this.preview = false;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
