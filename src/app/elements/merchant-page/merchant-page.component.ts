import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'src/app/objects/store';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
  @Input() banners: Array<string> = [];
  @Input() menuImages: Array<string> = [];
  @Input() profileImage: string;
  @Input() isEditing: boolean;
  @Input() isFollowed: boolean;
  @Input() isAuthenticated: boolean;
  @Input() itemService;
  @Input() authFollowService;
  @Input() facebookService;
  @Input() reviewService;
  @Output() onEditBannersClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditProfileImageClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditQuickMenuClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditOpeningHoursClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditDescriptionClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditStoreTypeClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditAddressClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditTagsClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditContactButtonClicked: EventEmitter<any> = new EventEmitter<any>();
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
  @Output() onEditWechatClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditFAQClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteFAQClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddMediaClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteContactButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  
  environment = environment;
  selectedCategory: string = 'all';
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  // todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  reviews = [];
  reviewPage = 1;
  itemLoading: WsLoading = new WsLoading;
  isInformationOpened: boolean;
  selectedInformationIndex: number = 0;
  isQuickMenuOpened: boolean;
  selectedQuickMenuIndex: number = 0;
  totalOfReviews: number = 0;
  medias;
  link: string;
  shareMessage: string = '';
  shareLinkThroughFB: string;
  shareLinkThroughTwitter: string;
  storeId;
  isSaveLoading: WsLoading = new WsLoading;
  isQrcodeLoading: WsLoading = new WsLoading;
  reviewLoading: WsLoading = new WsLoading;
  reviewLazyLoading: WsLoading = new WsLoading;
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
      this.link = environment.URL + 'page/' + this.store.username;
      this.shareLinkThroughFB = this.link;
      this.shareMessage = `View ${this.store.name} - Wonder Scale.`;
      this.shareLinkThroughTwitter = `https://twitter.com/intent/tweet?text=${this.shareMessage} ${this.link}`;
      this.displayImage = this.store.profileImage ? 'api/images/' + this.store.profileImage.replace(/\//g, ',') : '';
      this.showQrcode();
      this.mapStore();
    }
    if (changes['banners'] && this.banners || changes['menuImages'] && this.menuImages) {
      setTimeout(() => {
        let mySwiper = document.querySelector('.swiper-container');
        if (mySwiper) {
            let swiper = mySwiper['swiper']
            swiper.update();
        };
      }, 300);
    }
    if (changes['profileImage']) {
      if (this.profileImage) {
        let isDataImage = this.profileImage.startsWith('data');
        if (isDataImage) {
          this.displayImage = this.profileImage;
        } else {
          this.displayImage = 'api/images/' + this.store.profileImage.replace(/\//g, ',');
        }
      } else {
        this.displayImage = '';
      }
      this.showQrcode();
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
        if (currentSection !== this.selectedNavItem && 
            this.selectedNavItem !== 'catalogue' && 
            this.selectedNavItem !== 'delivery' && 
            this.selectedNavItem !== 'faq' &&
            this.selectedNavItem !== 'reviews') {
          this.selectedNavItem = currentSection;
        }
        if (this.selectedNavItem === 'reviews') {
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          if ((scrollHeight - clientHeight - scrollTop) < 50) {
            if (!this.reviewLazyLoading.isRunning()) {
              this.reviewPage++;
              this.getReviews(true);
            }
          }
        }
    });
  }
  showQrcode() {
    setTimeout(() => {
      this.isQrcodeLoading.start();
      let target = '.qrcode';
      $(target).empty();
      if (this.displayImage) {
        let newImage = <HTMLImageElement>document.createElement('img');
        newImage.alt = 'profile-image';
        newImage.src = this.displayImage;
        newImage.addEventListener('load', e => {
          $(target).empty();
          let url = environment.URL + 'page/' + this.store.username;
          QRCodeBuilder.createQRcode(target, url, {
            width: 100, height: 100, color: '#505f79', callback: () => {
              this.isQrcodeLoading.stop();
            }
          })
            .then(() => {
              QRCodeBuilder.renderProfileImageToQrcode(target, newImage, 100);
            });
        });
      } else {
        $(target).empty();
        let url = environment.URL + 'page/' + this.store.username;
        QRCodeBuilder.createQRcode(target, url, {
          width: 100, height: 100, color: '#505f79', callback: () => {
            this.isQrcodeLoading.stop();
          }
        })
      }
    });
  }
  openInformation(index) {
    this.isInformationOpened = true;
    this.selectedInformationIndex = index;
  }
  openQuickMenu(index) {
    this.isQuickMenuOpened = true;
    this.selectedQuickMenuIndex = index;
  }
  getItemsByCategoryId(value) {
    this.itemLoading.start();
    if (value == 'all') {
      _.delay(() => {
        this.items = this.allItems;
        this.itemLoading.stop()
      }, 500);
    // } else if (value == 'todayspecial') {
    //   _.delay(() => {
    //     this.items = this.todaySpecialItems;
    //     this.itemLoading.stop();
    //   }, 500);
    // } else if (value == 'discount') {
    //   _.delay(() => {
    //     this.items = this.discountItems;
    //     this.itemLoading.stop();
    //   }, 500);
    } else if (value == 'new') {
      _.delay(() => {
        this.items = this.newItems;
        this.itemLoading.stop();
      }, 500);
    } else {
        this.itemService.getItemsByCategoryId(value)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
          this.items = result['result'];
        });
    }
  }
  saveStore() {
    this.isSaveLoading.start();
      this.authFollowService.followStore(this.store._id)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.isFollowed = result['result'];
        this.isSaveLoading.stop();
      }, () => {
        this.isSaveLoading.stop();
      });
  }
  unsaveStore() {
    this.isSaveLoading.start();
      this.authFollowService.unfollowStore(this.store._id)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
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
      // this.discountItems = this.store['discountItems'];
      // this.todaySpecialItems = this.store['todaySpecialItems'];
      this.categories = this.store['onSellingCategories'];
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
      message: this.shareMessage,
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
  navigateToShopping() {
    if (this.isEditing) {
      return;
    }
    this.router.navigate(['/page', this.store.username, 'cart-menu']);
  }
  navigateByContactButton() {
    if (this.store.contactButton) {
      let contactValue = '';
      switch (this.store.contactButton.type) {
        case 'url':
          contactValue = this.store.contactButton.value;
          break;
        case 'phoneCall':
          contactValue = 'tel:' + this.store.contactButton.value;
          break;
        case 'whatsapp':
          contactValue = 'https://wa.me/' + this.store.contactButton.value;
          break;
        case 'instagram':
          contactValue = 'https://www.instagram.com/' + this.store.contactButton.value;
          break;
        case 'messenger':
          contactValue = 'http://m.me/' + this.store.contactButton.value;
          break;
      }
      window.open(
        contactValue,
        '_blank' // <- This is what makes it open in a new window.
      );
    }
  }
  getReviews(lazyLoad=false) {
    if (this.reviewService) {
      if (lazyLoad) {
        this.reviewLazyLoading.start();
      } else {
        this.reviewLoading.start();
      }
      this.reviewService.getReviews({store: this.store._id, page: this.reviewPage}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.reviewLoading.stop(); this.reviewLazyLoading.stop()})).subscribe(result => {
        this.totalOfReviews = result['total'];
        if (lazyLoad) {
          this.reviews = [...this.reviews, ...result['result']]
        } else {
          this.reviews = result['result'];
        }
      });
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
