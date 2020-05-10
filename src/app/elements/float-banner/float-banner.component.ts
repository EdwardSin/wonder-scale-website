import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Shop } from '@objects/shop';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import * as $ from 'jquery';
import { FacebookService, UIParams, InitParams } from 'ngx-facebook';
import { environment } from '@environments/environment';
import { WsLoading } from '../ws-loading/ws-loading';
import { Item } from '@objects/item';

@Component({
  selector: 'float-banner',
  templateUrl: './float-banner.component.html',
  styleUrls: ['./float-banner.component.scss']
})
export class FloatBannerComponent implements OnInit {
  @Input() element;
  @Input() type: 'item' | 'shop';
  loading: WsLoading = new WsLoading;
  isShareModalOpened: boolean;
  isQRCodeModalOpened: boolean;
  isInformationModalOpened: boolean;
  link: string;
  shareLinkThroughFB: string;
  shareLinkThroughTwitter: string;
  shareLinkThroughEmail: string;
  constructor(private facebookService: FacebookService) { 
    let initParams: InitParams = {
      appId: '246047829574930',
      xfbml: true,
      version: 'v2.8'
    };
    facebookService.init(initParams);
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.element) {
      if (this.type == 'shop') {
        this.link = 'https://www.wonderscale.com/shops/' + this.element._id;
        this.shareLinkThroughFB = this.link;
        this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
        this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
      } else {
        this.link = 'https://www.wonderscale.com/item/' + this.element._id;
        this.shareLinkThroughFB = this.link;
        this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
        this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
      }
    }
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
  showQrcode() {
    $(() => {
      QRCodeBuilder.createQRcode('.qrcode', this.element['username'], this.element._id, { width: 150, height: 150});
      $(() => {
        let image = <HTMLImageElement>document.createElement('img');
        image.crossOrigin = 'anonymous';
        image.src = environment.IMAGE_URL + this.element.profileImage;
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
}
