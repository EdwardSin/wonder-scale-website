import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { Store } from '@objects/store';
import { FacebookService, InitParams, UIParams } from 'ngx-facebook';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { environment } from '@environments/environment';
import { takeUntil } from 'rxjs/operators';
import { SharedStoreService } from '@services/shared-store.service';
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
  
  store: Store;
  link: string = '';
  shareLinkThroughFB: string = '';
  shareLinkThroughTwitter: string = '';
  shareLinkThroughEmail: string = '';
  displayImage: string = '';
  isQrcodeLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private clipboard: Clipboard,
    private facebookService: FacebookService,
    private qrCodeBuilder: QRCodeBuilder,
    private sharedStoreService: SharedStoreService
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
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
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
      setTimeout(() => {
        this.isQrcodeLoading.start();
        let newImage = <HTMLImageElement>document.createElement('img');
        newImage.alt = 'profile-image';
        newImage.src = this.displayImage;
        newImage.addEventListener('load', e => {
          let url = environment.URL + 'page/' + this.store.username + '?id=' + this.store._id + '&type=qr_scan';
          QRCodeBuilder.createQRcode('.qrcode', url, { width: 150, height: 150, callback: () => {
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
