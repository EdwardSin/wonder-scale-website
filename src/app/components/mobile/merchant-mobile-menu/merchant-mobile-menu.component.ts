import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Store } from '@objects/store';
import { ItemService } from '@services/http/public/item.service';
import { SharedStoreService } from '@services/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'merchant-mobile-menu',
  templateUrl: './merchant-mobile-menu.component.html',
  styleUrls: ['./merchant-mobile-menu.component.scss']
})
export class MerchantMobileMenuComponent implements OnInit {
  store: Store;
  menuImages: Array<string> = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(public itemService: ItemService,
    private sharedStoreService: SharedStoreService,
    private router: Router) { 
      this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.store = result;
        this.menuImages = this.store.menuImages.map(informationImage => environment.IMAGE_URL + informationImage);
    })
  }
  ngOnInit(): void {
  }
  navigateToStore() {
    this.router.navigate(['/page/mobile/' + this.store.username + '/info'], {queryParamsHandling: 'merge'});
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
