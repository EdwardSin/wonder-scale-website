import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Shop } from '@objects/shop';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { FacebookService, UIParams, InitParams } from 'ngx-facebook';
import { environment } from '@environments/environment';
import { WsLoading } from '../ws-loading/ws-loading';
import { AuthFollowService } from '@services/http/auth/auth-follow.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, combineLatest, timer } from 'rxjs';
import { SharedUserService } from '@services/shared/shared-user.service';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'float-banner',
  templateUrl: './float-banner.component.html',
  styleUrls: ['./float-banner.component.scss']
})
export class FloatBannerComponent implements OnInit {
  @Input() element;
  @Input() type: 'item' | 'shop';
  loading: WsLoading = new WsLoading;
  isShownLocation: boolean;
  isShareModalOpened: boolean;
  isQRCodeModalOpened: boolean;
  isInformationModalOpened: boolean;
  link: string;
  shareLinkThroughFB: string;
  shareLinkThroughTwitter: string;
  shareLinkThroughEmail: string;
  medias;
  saved: boolean;
  isMobileSize: boolean;
  isQrcodeLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private facebookService: FacebookService,
    private ref: ChangeDetectorRef,
    private qrCodeBuilder: QRCodeBuilder,
    private authFollowService: AuthFollowService,
    private screenService: ScreenService,
    private sharedUserService: SharedUserService
  ) {
    let initParams: InitParams = {
      appId: environment.FACEBOOK_APP_ID,
      xfbml: true,
      version: 'v2.8'
    };
    facebookService.init(initParams);
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
  }

  ngOnInit(): void {
    this.sharedUserService.followPages.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (this.element) {
        this.saved = result.includes(this.element._id);
      }
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.element) {
      if (this.type == 'shop') {
        this.isFollowedShop();
        this.link = environment.URL + 'page/' + this.element.username + '?id=' + this.element._id;
        this.shareLinkThroughFB = this.link;
        this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
        this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
        if (this.element['location'] && this.element['location']['coordinates'] && this.element['location']['coordinates'].length) {
          this.isShownLocation = this.element['location']['coordinates'][0] != 0 && this.element['location']['coordinates'][1] != 0;
        }
        if (this.element.media && this.element.media.length) {
          this.medias = _.groupBy(this.element.media, 'type');
        }
        if (this.element.phone) {
          this.element.phone = _.filter(this.element.phone, (phone) => !_.isEmpty(phone));
        }
        if (this.element.email) {
          this.element.email = _.filter(this.element.email, (email) => !_.isEmpty(email));
        }
        if (this.element.website) {
          this.element.website = _.filter(this.element.website, (website) => !_.isEmpty(website));
        }

      } else {
        this.isFollowedItem();
        this.link = environment.URL + 'item/' + this.element._id;
        this.shareLinkThroughFB = this.link;
        this.shareLinkThroughTwitter = 'https://twitter.com/intent/tweet?text=Welcome to view my page now. ' + this.link;
        this.shareLinkThroughEmail = 'mailto:?body=' + this.link;
        if (this.element['shop']['location'] && this.element['shop']['location']['coordinates'] && this.element['shop']['location']['coordinates'].length) {
          this.isShownLocation = this.element['shop']['location']['coordinates'][0] != 0 && this.element['shop']['location']['coordinates'][1] != 0;
        }
      }
    }
  }
  isFollowedShop() {
    this.authFollowService.isFollowedShop(this.element._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.saved = result['result'];
    })
  }
  isFollowedItem() {
    this.authFollowService.isFollowedItem(this.element._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.saved = result['result'];
    })
  }
  saveShop() {
    combineLatest(timer(500),
      this.authFollowService.followShop(this.element._id))
      .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.saved = result['result'];
      });
  }
  saveItem() {
    combineLatest(timer(500),
      this.authFollowService.followItem(this.element._id))
      .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.saved = result['result'];
        let followItems = this.sharedUserService.followItems.value;
        followItems = _.uniq(followItems);
        followItems.push(this.element._id);
        this.sharedUserService.followItems.next(followItems);
      });
  }
  unsaveShop() {
    combineLatest(timer(500),
      this.authFollowService.unfollowShop(this.element._id))
      .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.saved = result['result'];
      });
  }
  unsaveItem() {
    combineLatest(timer(500),
      this.authFollowService.unfollowItem(this.element._id))
      .pipe(map(x => x[1]), takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.saved = result['result'];
        let followItems = this.sharedUserService.followItems.value;
        followItems = _.filter(followItems, (id) => id != this.element._id);
        this.sharedUserService.followItems.next(followItems);
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
      .catch(err => { });
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
            let url = environment.URL + 'page/' + this.element.username + '?id=' + this.element.id;
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
  }
}
