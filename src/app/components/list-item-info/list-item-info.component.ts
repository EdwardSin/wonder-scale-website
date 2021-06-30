import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Subject, combineLatest, timer } from 'rxjs';
import { takeUntil, finalize, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { CurrencyService } from '@services/http/general/currency.service';
import { WsLoading } from 'src/app/elements/ws-loading/ws-loading';
import { SharedUserService } from '@services/shared/shared-user.service';
import { FacebookService, UIParams } from 'ngx-facebook';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { OnSellingItem } from '@objects/on-selling-item';
import { OnSellingItemService } from '@services/http/public/on-selling-item.service';
import { Item } from '@objects/item';

@Component({
  selector: 'list-item-info',
  templateUrl: './list-item-info.component.html',
  styleUrls: ['./list-item-info.component.scss']
})
export class ListItemInfoComponent implements OnInit {
  onSellingItem: OnSellingItem;
  name: string = '';
  price: number = 0;
  discount: number = 0;
  quantity: number;
  selectedType;
  defaultType;

  profileImages: Array<string> = [];
  selectedProfileIndex: number = 0;
  environment = environment;
  link: string;
  currencies = [];
  shareLinkThroughFB: string;
  shareLinkThroughTwitter: string;
  shareLinkThroughEmail: string;
  isShareModalOpened: boolean;
  saved: boolean;
  loading: WsLoading = new WsLoading;
  @ViewChild('galleryThumbs') galleryThumbs: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(public currencyService: CurrencyService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private onSellingItemService: OnSellingItemService,
    private facebookService: FacebookService,
    private authFollowService: AuthFollowService,
    private sharedUserService: SharedUserService) { }

  ngOnInit(): void {
    let itemId = this.route.snapshot.queryParams.item_id;
    let preview = this.route.snapshot.queryParams.preview;
    if (preview == 'true') {
      this.getPreviewItemById(itemId);
    } else {
      this.getItemById(itemId);
    }
    this.currencyService.currenciesBehaviourSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.currencies = result;
    })
  }
  getItemById(id) {
    this.loading.start();
    this.onSellingItemService.getItemWithSellerById(id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result && result.result) {
        this.onSellingItem = result.result;
        this.mapItem();
      }
    })
  }
  getPreviewItemById(id) {
    this.loading.start();
    let storeId = this.route.snapshot.queryParams.id;
    this.onSellingItemService.getPreviewItemWithSellerById(id, storeId).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result && result.result) {
        this.onSellingItem = result.result;
        this.mapItem();
      }
    })
  }
  mapItem() {
    let item = this.onSellingItem?.item as Item;
    DocumentHelper.setWindowTitleWithWonderScale(item?.name);
    if (item?.types?.length > 0) {
      item.types = item?.types.map(type => {
        return {
          ...type,
          images: type.images.length > 0 ? type.images : item.profileImages.length > 0 ? item.profileImages : [],
          quantity: type.quantity || item?.quantity,
          price: type.price || item?.price,
          discount: type.discount || item?.discount,
        }
      });
    } else {
      item.types = [{
        quantity: this.onSellingItem.quantity,
        price: item?.price,
        discount: item?.discount,
        images: item?.profileImages,
        weight: item?.weight
      }];
    }
    this.onSellingItem['isDiscountExisting'] = item.isOffer && (item.types.find(type => type.discount > 0) != null || item.discount > 0);
    this.defaultType = item.types[0];
    this.selectedType = item.types[0];
    this.name = item.name;
    this.price = this.defaultType.price;
    this.quantity = this.defaultType.quantity;
    this.discount = this.defaultType.discount;
    this.selectedProfileIndex = item.profileImageIndex > -1 ? item.profileImageIndex : 0;
    this.profileImages = _.union(_.flattenDeep([item.profileImages, item.types.map(type => type.images), (item.descriptionImages || [])]));
    this.profileImages = _.filter(this.profileImages, image => !_.isEmpty(image));
    this.profileImages = this.profileImages.slice(0, 16);
    this.renderItemInfo();
  }
  renderItemInfo() {
    this.isFollowedItem();
    if (this.onSellingItem.store) {
      this.link = environment.URL + '?id=' + this.onSellingItem.store['_id'] + '&item_id=' + this.onSellingItem._id;
      this.shareLinkThroughFB = this.link;
      this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
      this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
    }
  }
  isFollowedItem() {
    this.authFollowService.isFollowedItem(this.onSellingItem._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.saved = result['result'];
    })
  }
  saveItem() {
    this.authFollowService.followItem(this.onSellingItem._id)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.saved = result['result'];
        let followItems = this.sharedUserService.followItems.value;
        followItems = _.uniq(followItems);
        followItems.push(this.onSellingItem._id);
        this.sharedUserService.followItems.next(followItems);
      }
    });
  }
  unsaveItem() {
    this.authFollowService.unfollowItem(this.onSellingItem._id)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.saved = result['result'];
        let followItems = this.sharedUserService.followItems.value;
        followItems = _.filter(followItems, (id) => id != this.onSellingItem._id);
        this.sharedUserService.followItems.next(followItems);
      }
    });
  }
  shareThroughFB() {
    let params: UIParams = {
        href: this.shareLinkThroughFB,
        method: 'share',
        display: 'popup'
    }
    this.facebookService.ui(params)
    .then(response => {
      console.log(response);
    })
    .catch(err => {});
  }
  selectProfileImage(image) {
    this.selectedProfileIndex = this.profileImages.indexOf(image);
    this.galleryThumbs['directiveRef'].setIndex(this.selectedProfileIndex);
  }
  onIndexChange(event) {
    let image = this.profileImages[event];
    this.selectedType = this.getItemBySelectedImage(image);
  }
  selectItemType(itemType) {
    this.selectedType = itemType;
    this.price = this.selectedType.price;
    this.quantity = this.selectedType.quantity;
    this.discount = this.selectedType.discount;
    if (this.selectedType['images'].length > 0) {
      this.selectProfileImage(this.selectedType['images'][0]);
    }
  }
  getItemBySelectedImage(image) {
    let item = this.onSellingItem.item as Item;
    let type = item.types.find(type => {
      return type.images.includes(image);
    });
    if (!type) {
      type = item.types[0];
    }
    return type;
  }
  closeModal() {
    this.router.navigate([], {queryParams: {item_id: null, modal: null}, queryParamsHandling: 'merge'});
  }
  navigateToStore() {
    this.router.navigate([], {queryParams: {modal: null}}).then(() => {
      this.router.navigate(['/page', this.onSellingItem.store['username']]);
    })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
