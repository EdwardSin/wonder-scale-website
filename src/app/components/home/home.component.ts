import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { AdvertisementService } from '@services/http/public/advertisement.service';
import { LocalStorageHelper } from '@helpers/storagehelper/storage.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper/core";
import { StoreService } from '@services/http/public/store.service';
import { ItemService } from '@services/http/public/item.service';
import { ScreenService } from '@services/general/screen.service';

// install Swiper modules
SwiperCore.use([Pagination, Navigation, Autoplay]);

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isOpenModal: boolean;
  keyword: string = '';
  recommendedStores = [];
  recommendedProducts = [];
  popOutAds = [];
  squareAds = [];
  largeAds = [];
  mediumAds = [];
  smallAds = [];
  currentNumber: number = 0;
  isMobileSize: boolean;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private storeService: StoreService,
    private itemService: ItemService,
    private router: Router, public advertisementService: AdvertisementService,
    private screenService: ScreenService) { 
    DocumentHelper.setWindowTitle('Wonder Scale');
  }

  ngOnInit(): void {
    this.getAdvertisements();
    this.getRecommendedStores();
    this.getRecommendedProducts();
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
  }
  displayAdvertisements = [];
  getAdvertisements() {
    this.advertisementService.getAdvertisements().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.popOutAds = this.advertisementService.getCurrentAdvertisement(result['popOutAds'], result['currentNumber']);
      this.squareAds = this.advertisementService.getCurrentAdvertisement(result['squareAds'], result['currentNumber']);
      this.largeAds = this.advertisementService.getCurrentAdvertisement(result['largeAds'], result['currentNumber']);
      this.mediumAds = this.advertisementService.getCurrentAdvertisement(result['mediumAds'], result['currentNumber']);
      this.smallAds = this.advertisementService.getCurrentAdvertisement(result['smallAds'], result['currentNumber']);
      if (this.popOutAds.length) {
        this.getAdsModal();
      }
      this.displayAdvertisements.push(...this.squareAds.slice(0, 1).map(x => x._id));
      this.displayAdvertisements.push(...this.largeAds.slice(0, 2).map(x => x._id));
      this.displayAdvertisements.push(...this.mediumAds.slice(0, 1).map(x => x._id));
      this.displayAdvertisements.push(...this.smallAds.slice(0, 2).map(x => x._id));
      this.viewAdvertisements(this.displayAdvertisements);
    });
  }
  viewAdvertisements(ids) {
    this.advertisementService.viewAdvertisements(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
  }
  getAdsModal() {
    const history = LocalStorageHelper.getItemObj('POPOUT-HISTORY');
    const currentDate = new Date();
    const currentDateAsString = currentDate.getFullYear() + '/' + currentDate.getDate() + '/' + currentDate.getMonth();
    for (let item of Object.keys(history)) {
      const date = new Date(history[item]);
      const dateAsString = date.getFullYear() + '/' + date.getDate() + '/' + date.getMonth();
      if (dateAsString !== currentDateAsString) {
        delete history[item];
      }
    }
    if (history && Object.keys(history).length < environment.MAX_NUMBER_ADS_POPOUT) {
      if (!(this.popOutAds[0]._id in history)) {
        history[this.popOutAds[0]._id] = new Date().getTime();
        this.displayAdvertisements.push(this.popOutAds[0]._id);
        this.isOpenModal = true;
        LocalStorageHelper.setItemObj('POPOUT-HISTORY', history);
      }
    }
  }
  getRecommendedStores() {
    this.storeService.getRecommendedStores().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.recommendedStores = result['result'];
    });
  }
  getRecommendedProducts() {
    this.itemService.getRecommendedProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.recommendedProducts = result['result'];
    });
  }
}
