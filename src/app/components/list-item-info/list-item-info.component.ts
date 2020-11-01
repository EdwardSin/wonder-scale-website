import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from '@services/http/public/item.service';
import { Subject, combineLatest, timer } from 'rxjs';
import { takeUntil, finalize, map } from 'rxjs/operators';
import { Item } from '@objects/item';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { CurrencyService } from '@services/http/general/currency.service';
import { WsLoading } from 'src/app/elements/ws-loading/ws-loading';
import { SharedUserService } from '@services/shared/shared-user.service';
import { FacebookService, UIParams } from 'ngx-facebook';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'list-item-info',
  templateUrl: './list-item-info.component.html',
  styleUrls: ['./list-item-info.component.scss']
})
export class ListItemInfoComponent implements OnInit {
  item: Item;
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
    private itemService: ItemService,
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
  }
  getItemById(id) {
    this.loading.start();
    this.itemService.getItemWithSellerById(id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result && result.result) {
        this.item = result.result;
        this.mapItem();
      }
    })
  }
  getPreviewItemById(id) {
    this.loading.start();
    let storeId = this.route.snapshot.queryParams.id;
    this.itemService.getPreviewItemWithSellerById(id, storeId).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result && result.result) {
        this.item = result.result;
        this.mapItem();
      }
    })
  }
  mapItem() {
    DocumentHelper.setWindowTitleWithWonderScale(this.item.name);
    if (this.item.types.length > 0) {
      this.item.types = this.item.types.map(type => {
        return {
          ...type,
          images: type.images.length > 0 ? type.images : this.item.profileImages.length > 0 ? this.item.profileImages : [],
          quantity: type.quantity || this.item.quantity,
          price: type.price || this.item.price,
          discount: type.discount || this.item.discount,
        }
      });
    } else {
      this.item.types = [{
        quantity: this.item.quantity,
        price: this.item.price,
        discount: this.item.discount,
        images: this.item.profileImages,
        weight: this.item.weight
      }];
    }
    this.item.isDiscountExisting = this.item.isOffer && (this.item.types.find(type => type.discount > 0) != null || this.item.discount > 0);
    this.defaultType = this.item.types[0];
    this.selectedType = this.item.types[0];
    this.name = this.item.name;
    this.price = this.defaultType.price;
    this.quantity = this.defaultType.quantity;
    this.discount = this.defaultType.discount;
    this.selectedProfileIndex = this.item.profileImageIndex > -1 ? this.item.profileImageIndex : 0;
    this.profileImages = _.union(_.flattenDeep([this.item.profileImages, this.item.types.map(type => type.images), (this.item.descriptionImages || [])]));
    this.profileImages = _.filter(this.profileImages, image => !_.isEmpty(image));
    this.profileImages = this.profileImages.slice(0, 16);
    this.renderItemInfo();
  }
  renderItemInfo() {
    this.isFollowedItem();
    if (this.item.store) {
      this.link = environment.URL + '?id=' + this.item.store._id + '&item_id=' + this.item._id;
      this.shareLinkThroughFB = this.link;
      this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
      this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
    }
  }
  isFollowedItem() {
    this.authFollowService.isFollowedItem(this.item._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.saved = result['result'];
    })
  }
  saveItem() {
    combineLatest(timer(500),
    this.authFollowService.followItem(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.saved = result['result'];
        let followItems = this.sharedUserService.followItems.value;
        followItems = _.uniq(followItems);
        followItems.push(this.item._id);
        this.sharedUserService.followItems.next(followItems);
      }
    });
  }
  unsaveItem() {
    combineLatest(timer(500),
    this.authFollowService.unfollowItem(this.item._id))
    .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.saved = result['result'];
        let followItems = this.sharedUserService.followItems.value;
        followItems = _.filter(followItems, (id) => id != this.item._id);
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
    let type = this.item.types.find(type => {
      return type.images.includes(image);
    });
    if (!type) {
      type = this.item.types[0];
    }
    return type;
  }
  closeModal() {
    this.router.navigate([], {queryParams: {item_id: null, modal: null}, queryParamsHandling: 'merge'});
  }
  navigateToStore() {
    this.router.navigate([], {queryParams: {modal: null}}).then(() => {
      this.router.navigate(['/page', this.item.store.username]);
    })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
