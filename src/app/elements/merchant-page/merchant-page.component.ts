import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'src/app/objects/store';
import { takeUntil, finalize, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { QRCodeBuilder } from '@builders/qrcodebuilder';

@Component({
  selector: 'merchant-page',
  templateUrl: './merchant-page.component.html',
  styleUrls: ['./merchant-page.component.scss']
})
export class MerchantPageComponent implements OnInit {
  @Input() store: Store;
  @Input() editingBanners: Array<string> = [];
  @Input() isEditing: boolean;
  @Input() isFollowed: boolean;
  @Input() isAuthenticated: boolean;
  @Input() itemService;
  @Input() authFollowService;
  @Input() facebookService;
  @Output() onEditBannersClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditProfileImageClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditOpeningHoursClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditDescriptionClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditStoreTypeClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditAddressClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditTagsClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditPhoneClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditEmailClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditWebsiteClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditFacebookClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditInstagramClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditTwitterClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditWhatsappClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditMessengerClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditYoutubeClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditSnapchatClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditTelegramClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditWeiboClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditWechatClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddMediaClicked: EventEmitter<any> = new EventEmitter<any>();
  
  environment = environment;
  selectedCategory: string = 'all';
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  itemLoading: WsLoading = new WsLoading;
  isInformationOpened: boolean;
  selectedInformationIndex: number = 0;
  medias;
  link: string;
  shareLinkThroughFB: string;
  shareLinkThroughTwitter: string;
  storeId;
  isSaveLoading: WsLoading = new WsLoading;
  isQrcodeLoading: WsLoading = new WsLoading;
  displayImage: string = '';
  selectedNavItem = 'overview';
  todayDate;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router) {
    let date = new Date;
    this.todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }
  ngOnInit() {
  }
  ngOnChanges (changes: SimpleChanges) {
    if (changes['store'] && this.store) {
      this.link = environment.URL + 'page/' + this.store.username + '?id=' + this.store._id;
      this.shareLinkThroughFB = this.link;
      this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
      this.displayImage = this.store.profileImage ? 'api/images/' + encodeURIComponent(this.store.profileImage) : 'assets/images/svg/dot.svg';
      if (!this.editingBanners.length && this.store.informationImages.length) {
        this.editingBanners = this.store.informationImages.map(image => environment.IMAGE_URL + image);
      }
      this.showQrcode();
      this.mapStore();
    }
    if (changes['editingBanners'] && this.editingBanners) {
      setTimeout(() => {
        console.log(this.editingBanners);
        let mySwiper = document.querySelector('.swiper-container');
        if (mySwiper) {
            let swiper = mySwiper['swiper']
            swiper.update();
        };
      }, 300);
    }
  }
  ngAfterViewInit() {
    window.addEventListener('scroll', (event) => {
        let currentSection: string = 'overview';
        const children = $('.details-container').children();
        const scrollTop = window.scrollY;
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (['DIV'].some(spiedTag => spiedTag === element.tagName)) {
                if ((element.offsetTop) <= scrollTop) {
                    currentSection = element.id;
                }
            }
        }
        if (currentSection !== this.selectedNavItem && this.selectedNavItem !== 'catalogue') {
          this.selectedNavItem = currentSection;
        }
    });
  }
  showQrcode() {
    setTimeout(() => {
      $('.qrcode').empty();
      this.isQrcodeLoading.start();
      let newImage = <HTMLImageElement>document.createElement('img');
      newImage.alt = 'profile-image';
      newImage.src = this.displayImage;
      newImage.addEventListener('load', e => {
        let url = environment.URL + 'page/' + this.store.username + '?id=' + this.store._id;
        QRCodeBuilder.createQRcode('.qrcode', url, { width: 100, height: 100, color: '#666', callback: () => {
          this.isQrcodeLoading.stop();
        }})
        .then(() => {
          this.renderProfileImageToQrcode(newImage, 100);
        });
      });
    });
  }
  renderProfileImageToQrcode(image, size) {
    let canvas = $('.qrcode').find('canvas')[0];
    if (canvas) {
      let context = (<HTMLCanvasElement>canvas).getContext('2d');
      let width = size / 3 * 46.7 / 70;
      let height = size / 3 * 46.7 / 70;
      let offsetInnerY = size / 3 * 6 / 70;
      let offsetX = size / 2 - width / 2;
      let offsetY = size / 2 - height / 2 - offsetInnerY;
      context.save();
      context.beginPath();
      context.arc(offsetX + width / 2, offsetY + width / 2, width / 2, 0, 2 * Math.PI);
      context.fill();
      context.clip();
      context.drawImage(image, offsetX, offsetY, width, height);
      context.restore();
    }
  }
  openInformation(index) {
    this.isInformationOpened = true;
    this.selectedInformationIndex = index;
  }
  getItemsByCategoryId(value) {
    this.itemLoading.start();
    if (value == 'all') {
      _.delay(() => {
        this.items = this.allItems;
        this.itemLoading.stop()
      }, 500);
    } else if (value == 'todayspecial') {
      _.delay(() => {
        this.items = this.todaySpecialItems;
        this.itemLoading.stop();
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
          this.items = result['result'];
        });
    }
  }
  saveStore() {
    this.isSaveLoading.start();
    combineLatest(timer(500),
      this.authFollowService.followStore(this.store._id))
      .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.isFollowed = result['result'];
        this.isSaveLoading.stop();
      }, () => {
        this.isSaveLoading.stop();
      });
  }
  unsaveStore() {
    this.isSaveLoading.start();
    combineLatest(timer(500),
      this.authFollowService.unfollowStore(this.store._id))
      .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.isFollowed = result['result'];
        this.isSaveLoading.stop();
      }, () => {
        this.isSaveLoading.stop();
      });
  }
  mapStore() {
    if (this.store) {
      this.storeId = this.store._id;
      this.allItems = this.store['allItems'];
      this.newItems = this.store['newItems'];
      this.discountItems = this.store['discountItems'];
      this.todaySpecialItems = this.store['todaySpecialItems'];
      this.categories = this.store['categories'];
      this.items = this.allItems;
      if (this.store.media) {
        this.medias = _.mapValues(_.groupBy(this.store.media, 'type'), medias => medias.map(media => media.value));
      }
    }
  }
  isAddressExisting () {
    return this.store && this.store.fullAddress && this.store.fullAddress.address && this.store.fullAddress.state && this.store.fullAddress.postcode && this.store.fullAddress.country;
  }
  scrollTo(id = '') {
    if (id) {
      this.selectedNavItem = id;
      let element = document.getElementById(id);
      this.router.navigate([], {queryParams: {nav: this.selectedNavItem}, queryParamsHandling: 'merge'});
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    }
    else {
      window.scrollTo(0, 0);
    }
  }
  shareThroughFB() {
    let params = {
      href: this.shareLinkThroughFB,
      method: 'share',
      display: 'popup'
    }
    this.facebookService.ui(params)
      .then(response => {
        console.log(response);
      })
      .catch(err => { });
  }
  navigateToMap() {
    window.open(`http://www.google.com/maps/place/${this.store.location.coordinates[1]},${this.store.location.coordinates[0]}`, '_blank');
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
