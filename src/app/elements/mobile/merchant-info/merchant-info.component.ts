import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@objects/store';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'merchant-info',
  templateUrl: './merchant-info.component.html',
  styleUrls: ['./merchant-info.component.scss']
})
export class MerchantInfoComponent implements OnInit {
  environment = environment;
  @Input() store: Store;
  @Input() isEditing: boolean = true;
  @Input() banners: Array<string> = [];
  @Input() profileImage: string;
  @Output() onEditBannersClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditProfileImageClicked: EventEmitter<any> = new EventEmitter<any>();
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
  @Output() onAddMediaClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteContactButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  message;
  medias;
  preview: boolean;
  isShownLocation: boolean;
  isInformationOpened: boolean = false;
  
  
  selectedInformationIndex: number = 0;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['store'] && this.store) {
      if (this.store.media) {
        this.medias = _.mapValues(_.groupBy(this.store.media, 'type'), medias => medias.map(media => media.value));
      }
      if (this.store.showAddress && this.store['location'] && this.store['location']['coordinates']) {
        this.isShownLocation = this.store['location']['coordinates'][0] != 0 && this.store['location']['coordinates'][1] != 0;
      }
      this.loading.stop();
    }
    if (changes['banners'] && this.banners) {
      setTimeout(() => {
        let mySwiper = document.querySelector('.swiper-container');
        if (mySwiper) {
            let swiper = mySwiper['swiper']
            swiper.update();
        };
      }, 300);
    }
  }

  ngOnInit(): void {
    this.loading.start();
  }
  openInformation(index) {
    this.isInformationOpened = true;
    this.selectedInformationIndex = index;
  }
  closeAlert() {
    this.preview = false;
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
  isAddressExisting () {
    return this.store && this.store.fullAddress && this.store.fullAddress.address && this.store.fullAddress.state && this.store.fullAddress.postcode && this.store.fullAddress.country;
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
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
