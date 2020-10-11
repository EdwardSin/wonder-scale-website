import { Component, OnInit } from '@angular/core';
import { SharedStoreService } from '@services/shared-store.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@objects/store';
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
  store: Store;
  message;
  medias;
  preview: boolean;
  isShownLocation: boolean;
  isInformationOpened: boolean = false;
  selectedInformationIndex: number = 0;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private sharedStoreService: SharedStoreService) {
  }

  ngOnInit(): void {
    this.loading.start();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        if (this.store.media && this.store.media.length) {
          this.medias = _.groupBy(this.store.media, 'type');
        }
        if (this.store.showAddress && this.store['location'] && this.store['location']['coordinates']) {
          this.isShownLocation = this.store['location']['coordinates'][0] != 0 && this.store['location']['coordinates'][1] != 0;
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
