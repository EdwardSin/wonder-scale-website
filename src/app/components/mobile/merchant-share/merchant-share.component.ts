import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { Shop } from '@objects/shop';
import { FacebookService, InitParams, UIParams } from 'ngx-facebook';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { environment } from '@environments/environment';
import { takeUntil } from 'rxjs/operators';
import { SharedShopService } from '@services/shared-shop.service';
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
  environment = environment;
  
  shop: Shop;
  link: string = '';
  shareLinkThroughFB: string = '';
  shareLinkThroughTwitter: string = '';
  shareLinkThroughEmail: string = '';
  isQrcodeLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private clipboard: Clipboard,
    private facebookService: FacebookService,
    private qrCodeBuilder: QRCodeBuilder,
    private sharedShopService: SharedShopService
  ) { 
    let initParams: InitParams = {
      appId: environment.FACEBOOK_APP_ID,
      xfbml: true,
      version: 'v2.8'
    };
    facebookService.init(initParams);
  }

  ngOnInit(): void {
    window.scrollTo({top: 0});
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.shop = result;
        this.link = environment.URL + 'page/' + this.shop.username + '?id=' + this.shop._id;
        this.shareLinkThroughFB = this.link;
        this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
        this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
        
        if (this.shop.phone) {
          this.shop.phone = _.filter(this.shop.phone, (phone) => !_.isEmpty(phone));
        }
        if (this.shop.email) {
          this.shop.email = _.filter(this.shop.email, (email) => !_.isEmpty(email));
        }
        if (this.shop.website) {
          this.shop.website = _.filter(this.shop.website, (website) => !_.isEmpty(website));
        }
        this.showQrcode(true);
      }
    })
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
      .catch(err => { });
  }
  copyLink() {
    this.clipboard.copy(this.link);
    WsToastService.toastSubject.next({content: 'Copied link!', type: 'success'});
  }
  showQrcode(event) {
    if (event)  {
      $(() => {
        this.isQrcodeLoading.start();
        let imageURL = 'assets/images/svg/dot.svg';
        this.qrCodeBuilder.toDataURL(imageURL, (dataUrl) => {
          let newImage = <HTMLImageElement>document.createElement('img');
          newImage.alt = 'profile-image';
          newImage.src = dataUrl;
          newImage.addEventListener('load', e => {
            let url = environment.URL + 'page/' + this.shop.username + '?id=' + this.shop._id + '&type=qr_scan';
            QRCodeBuilder.createQRcode('.qrcode', url, { width: 150, height: 150})
            .then(() => {
              this.renderProfileImageToQrcode(newImage, 150);
              this.isQrcodeLoading.stop();
            });
          });
        });
      });
    } else {
      $('.qrcode').empty();
    }
  }
  renderProfileImageToQrcode(image, size) {
    let canvas = document.getElementById('canvas1');
    if (canvas) {
      let context = (<HTMLCanvasElement>canvas).getContext('2d');
      let width = size / 3 * 46.7 / 70;
      let height = size / 3 * 46.7 / 70;
      let offsetInnerY = size / 3 * 4.9 / 70;
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
