import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
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
  banners: Array<string> = [];
  profileImage: string;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService) { 
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      this.banners = this.store.informationImages.map(informationImage => environment.IMAGE_URL + informationImage);
      this.profileImage = this.store.profileImage ? environment.IMAGE_URL + this.store.profileImage : null;
      this.banners = [
        '/assets/images/extra/bagel_01.jpg',
        '/assets/images/extra/bagel_02.jpg',
        '/assets/images/extra/bagel_03.jpg',
        '/assets/images/extra/bagel_04.jpg',
        '/assets/images/extra/bagel_05.jpg',
        '/assets/images/extra/bagel_06.jpg'
      ];
      // this.menuImages = [
      //   '/assets/images/extra/chips_01.jpg',
      //   '/assets/images/extra/chips_02.jpg',
      //   '/assets/images/extra/chips_03.jpg'
      // ];
      this.profileImage = '/assets/images/extra/icon.jpg';
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
