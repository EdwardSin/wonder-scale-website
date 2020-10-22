import { Component, OnInit } from '@angular/core';
import { Store } from '@objects/store';
import { SharedStoreService } from '@services/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'merchant-mobile-info',
  templateUrl: './merchant-mobile-info.component.html',
  styleUrls: ['./merchant-mobile-info.component.scss']
})
export class MerchantMobileInfoComponent implements OnInit {
  store: Store;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService) { 
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
