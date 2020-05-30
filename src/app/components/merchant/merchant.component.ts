import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Shop } from 'src/app/objects/shop';
import { takeUntil, finalize, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { ShopService } from '@services/http/public/shop.service';
import { ItemService } from '@services/http/public/item.service';
import { CategoryService } from '@services/http/public/category.service';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import * as _ from 'lodash';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  environment = environment;
  selectedCategory: string = 'all';
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  loading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  shop: Shop;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router, 
    private route: ActivatedRoute, private shopService: ShopService,
    private authFollowService: AuthFollowService,
    private sharedUserService: SharedUserService,
    private categoryService: CategoryService,
    private itemService: ItemService) {
  }

  ngOnInit() {
    let shopId = this.route.snapshot.queryParams.id;
    this.getShopById(shopId);
    this.getAllItemsById(shopId);
    this.getNewItemsById(shopId);
    this.getDiscountItemsById(shopId);
    this.getCategoriesById(shopId);

    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(event => {
      if (event instanceof NavigationEnd) {
        DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
      }
    });
  }
  getShopById(id) {
    this.loading.start();
    this.shopService.getShopById(id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.shop = result.result;
      DocumentHelper.setWindowTitleWithWonderScale(this.shop.name);
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
      _.delay(() => {
        this.items = this.allItems;
        this.itemLoading.stop()
      }, 500);
    } else if (value == 'discount') {
      _.delay(() => {
        this.items = this.discountItems;
        this.itemLoading.stop();
      }, 500);
    } else if (value == 'new') {
      _.delay(() => {
        this.items = this.newItems;
        this.itemLoading.stop();
      }, 500);
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
  scrollTo(id = '') {
    if (id) {
      let element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    }
    else {
      window.scrollTo(0, 0);
    }
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
