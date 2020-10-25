import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { Store } from '@objects/store';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { Clipboard } from '@angular/cdk/clipboard';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';

@Component({
  selector: 'merchant-share',
  templateUrl: './merchant-share.component.html',
  styleUrls: ['./merchant-share.component.scss']
})
export class MerchantShareComponent implements OnInit {
  @Input() facebookService;
  @Input() store: Store;
  @Input() isEditing: boolean;
  @Input() profileImage: string;
  environment = environment;
  link: string = '';
  shareLinkThroughFB: string = '';
  shareLinkThroughTwitter: string = '';
  shareLinkThroughEmail: string = '';
  displayImage: string = '';
  isQrcodeLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private clipboard: Clipboard
  ) { 
  }

  ngOnInit(): void {
    window.scrollTo({top: 0});
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['store'] && this.store) {
      this.link = environment.URL + 'page/' + this.store.username + '?id=' + this.store._id;
      this.shareLinkThroughFB = this.link;
      this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
      this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
      this.displayImage = this.store.profileImage ? 'api/images/' + encodeURIComponent(this.store.profileImage) : 'assets/images/svg/dot.svg';
      
      if (this.store.phone) {
        this.store.phone = _.filter(this.store.phone, (phone) => !_.isEmpty(phone));
      }
      if (this.store.email) {
        this.store.email = _.filter(this.store.email, (email) => !_.isEmpty(email));
      }
      if (this.store.website) {
        this.store.website = _.filter(this.store.website, (website) => !_.isEmpty(website));
      }
      this.showQrcode(true);
    }
    
    if (changes['profileImage']) {
      if (this.profileImage) {
        let isDataImage = this.profileImage.startsWith('data');
        if (isDataImage) {
          this.displayImage = this.profileImage;
        } else {
          this.displayImage = 'api/images/' + encodeURIComponent(this.store.profileImage);
        }
      } else {
        this.displayImage = 'assets/images/svg/dot.svg';
      }
      this.showQrcode(true);
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
  copyLink() {
    this.clipboard.copy(this.link);
    WsToastService.toastSubject.next({content: 'Copied link!', type: 'success'});
  }
  showQrcode(event) {
    if (event)  {
      setTimeout(() => {
        this.isQrcodeLoading.start();
        let newImage = <HTMLImageElement>document.createElement('img');
        newImage.alt = 'profile-image';
        newImage.src = this.displayImage;
        $('.qrcode').empty();
        newImage.addEventListener('load', e => {
          $('.qrcode').empty();
          let url = environment.URL + 'page/' + this.store.username + '?id=' + this.store._id + '&type=qr_scan';
          QRCodeBuilder.createQRcode('.qrcode', url, { width: 150, height: 150, color: '#666', callback: () => {
            this.isQrcodeLoading.stop();
          }})
          .then(() => {
            this.renderProfileImageToQrcode(newImage, 150);
          });
        });
      });
    } else {
      $('.qrcode').empty();
    }
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
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.showQrcode(false);
  }
}
