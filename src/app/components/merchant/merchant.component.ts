import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shop } from 'src/app/objects/shop';
import { takeUntil, finalize, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { ShopService } from '@services/http/shop.service';
import { ItemService } from '@services/http/item.service';
import { CategoryService } from '@services/http/category.service';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { WsLoading } from 'src/app/elements/ws-loading/ws-loading';
import { CurrencyService } from '@services/general/currency.service';
import { FacebookService, InitParams, UIParams } from 'ngx-facebook';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import * as $ from 'jquery';

@Component({
  selector: 'merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  environment = environment;
  selectedCategory: string = 'all';
  items: Array<any> = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  loading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  isShareModalOpened: boolean;
  isQRCodeModalOpened: boolean;
  isInformationModalOpened: boolean;
  images: Array<any> = ['', '', '', '', '', '', '', ''];
  shop: Shop;
  private ngUnsubscribe: Subject<any> = new Subject;
  private fragment: string;
  constructor(private route: ActivatedRoute, private shopService: ShopService,
    private facebookService: FacebookService,
    private categoryService: CategoryService,
    private itemService: ItemService) { 
      let initParams: InitParams = {
        appId: '246047829574930',
        xfbml: true,
        version: 'v2.8'
      };
      facebookService.init(initParams);
    let shopId = '5e9075d93e9b545504b29f53' || this.route.snapshot.params.id;
    this.getShopById(shopId);
    this.getAllItemsById(shopId);
    this.getNewItemsById(shopId);
    this.getDiscountItemsById(shopId);
    this.getCategoriesById(shopId);
  }

  ngOnInit() {
  }
  getShopById(id) {
    this.loading.start();
    this.shopService.getShopById(id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.shop = result.result;
    });
  }
  getAllItemsById(id) {
    this.itemService.getAllItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.allItems = result.result;
      this.items = this.allItems;
    });
  }
  getNewItemsById(id) {
    this.itemService.getNewItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.newItems = result.result;
    });
  }
  getDiscountItemsById(id) {
    this.itemService.getDiscountItemsByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.discountItems = result.result;
    });
  }
  getCategoriesById(id) {
    this.categoryService.getCategoriesByShopId(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.categories = result.result;
    })
  }
  getItemsByCategoryId(value) {
    this.itemLoading.start();
    if (value == 'all') {
      this.items = this.allItems;
    } else {
      combineLatest(timer(500),
        this.itemService.getItemsByCategoryId(value))
      .pipe(takeUntil(this.ngUnsubscribe), map(x => x[1]), finalize(() => this.itemLoading.stop())).subscribe(result => {
        this.items = result.result;
      });
    }
  }
  likeShop() {
    
  }
  unlinkShop() {

  }
  shareShop() {
    let params: UIParams = {
        href: 'https://www.wonderscale.com/shop/' + this.shop._id,
        method: 'share',
        display: 'popup'
    }
    this.facebookService.ui(params)
    .then(response => {
      console.log(response);
    })
    .catch(err => {});
  }
  showQrcode() {
    $(() => {
      QRCodeBuilder.createQRcode('.qrcode', this.shop.username, this.shop._id, { width: 150, height: 150});
      $(() => {
        let image = <HTMLImageElement>document.createElement('img');
        image.crossOrigin = 'anonymous';
        image.src = environment.IMAGE_URL + this.shop.profileImage;
        image.alt = 'profile-image';
        image.addEventListener('load', e => {
          setTimeout(() => {
            this.renderProfileImageToQrcode(image, 150);
          }, 300);
        });
      });
    });
  }
  renderProfileImageToQrcode(image, size) {
    let canvas = document.getElementById('canvas1');
    if (canvas) {
      let context =(<HTMLCanvasElement>canvas).getContext('2d');
      let width = size / 3 * 185 / 300;
      let height = size / 3 * 185 / 300;
      let offsetyY = size * 9 / 300;
      let offsetX = size/2 - width/2;
      let offsetY = size/2 - height/2 - offsetyY;
      context.save();
      context.beginPath();
      context.arc(offsetX + width/2, offsetY + width/2, width/2, 0, 2*Math.PI);
      context.fill();
      context.clip();
      context.drawImage(image, offsetX, offsetY, width, height);
      context.restore();
    }
  }
  
  showInformation() {

  }
  showLocation() {

  }
  scrollTo(id='') {
    if (id) {
      let element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }
    }
    else {
      window.scrollTo(0, 0);
    }
  }
}
