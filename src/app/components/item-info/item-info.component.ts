import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '@services/http/public/item.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Item } from '@objects/item';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { SwiperDirective } from 'ngx-swiper-wrapper';
import { CurrencyService } from '@services/http/general/currency.service';
import { WsLoading } from 'src/app/elements/ws-loading/ws-loading';

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss']
})
export class ItemInfoComponent implements OnInit {
  item: Item;

  name: string = '';
  price: number = 0;
  discount: number = 0;
  quantity: number;
  selectedType;

  profileImages: Array<string> = [];
  selectedProfileIndex: number = 0;
  environment = environment;
  loading: WsLoading = new WsLoading;
  @ViewChild('galleryThumbs') galleryThumbs: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(public currencyService: CurrencyService, 
    private route:ActivatedRoute, 
    private itemService: ItemService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.getItemById(id);
  }
  ngAfterViewInit() {
  }
  getItemById(id) {
    this.loading.start();
    this.itemService.getItemWithSellerById(id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.item = result.result;
      if (this.item.types.length > 0) {
        this.item.types = this.item.types.map(type => {
          return {
            ...type,
            images: type.images.length > 0 ? type.images : this.item.profileImages.length > 0 ? this.item.profileImages: [],
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
      this.selectedType = this.item.types[0];
      this.name = this.item.name;
      this.price = this.selectedType.price;
      this.quantity = this.selectedType.quantity;
      this.discount = this.selectedType.discount;
      this.selectedProfileIndex = this.item.profileImageIndex > -1 ? this.item.profileImageIndex : 0;
      this.profileImages = _.union(_.flattenDeep([this.item.profileImages, this.item.types.map(type => type.images)]));
      this.profileImages = _.filter(this.profileImages, image => !_.isEmpty(image));
      this.profileImages = this.profileImages.slice(0, 16);
    })
  }
  selectProfileImage(image) {
    this.selectedProfileIndex = this.profileImages.indexOf(image);
    this.galleryThumbs['directiveRef'].setIndex(this.selectedProfileIndex);
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
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
