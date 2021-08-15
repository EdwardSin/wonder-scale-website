import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { Delivery } from '@objects/delivery';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-invoice',
  templateUrl: './ws-invoice.component.html',
  styleUrls: ['./ws-invoice.component.scss']
})
export class WsInvoiceComponent implements OnInit {
  @Input() item;
  @Input() isPublic: boolean;
  @Input() showReview;
  @Input() showDeliveryDetails;
  @Input() showStatusDetails;
  @Input() showStatusStepper = true;
  @Input() isSaveEnabled: boolean;
  @Input() isSaved: boolean;
  @Input() save: Function;
  @Input() unsave: Function;
  @Input() updateDelivery: Function;
  @Input() submitReview: Function;
  @Input() deliveries: Array<Delivery> = [];
  @Output() onPayslipClicked: EventEmitter<any> = new EventEmitter<any>();
  promotion;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  productQualityRating: number = 0;
  sellerServiceRating: number = 0;
  deliveryServiceRating: number = 0;
  comment: string = '';
  reviewSubmit: boolean;
  isDeliveryDetailsAvailable: boolean;
  etaDate;
  isShowStepper: boolean;
  selectedDelivery = '';
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['item']) {
      this.notifyCalculation();
      if (this.item && this.item.delivery && this.item.delivery.etaDate) {
        let etaDate = new Date(this.item.delivery.etaDate);
        if (this.item.delivery.etaHour > -1) {
          etaDate.setHours(this.item.delivery.etaHour);
          etaDate.setMinutes(this.item.delivery.etaMin);
        }
        this.etaDate = etaDate;
      }
      if (this.item?.delivery?._id) {
        this.selectedDelivery = this.item?.delivery?._id || '';
      }
      this.isDeliveryDetailsAvailable = this._isDeliveryDetailsAvailable();
    }
  }
  ngOnInit(): void {
  }
  notifyCalculation() {
    this.delivery = this.item.totalDelivery;
    this.discount = this.item.totalDiscount;
    this.subtotal = this.item.subtotal;
    this.total = this.item.total;
  }
  _isDeliveryDetailsAvailable() {
    return (this.item.customer && this.item.customer.recipientName) ||
            (this.item.customer && this.item.customer.phoneNumber) ||
            (this.item.customer && this.item.customer.address && this.item.customer.address.address && this.item.customer.address.state && this.item.customer.address.postcode);
  }
  onDeliveryChange() {
    if (this.selectedDelivery == '') {
      this.delivery = 0;
    } else {
      let delivery = this.deliveries.find(delivery => {
        return delivery._id === this.selectedDelivery;
      });
      if (delivery) {
        this.delivery = delivery.fee;
      }
    }
    this.total = this.item.subtotal + this.delivery - this.discount;
    if (this.item.status == 'wait_for_approval') {
      this.onUpdateDeliveryClicked();
    }
  }
  onDeliveryInputChange(event) {
    this.total = this.item.subtotal + (+this.delivery) - this.discount;
    if (this.item.status == 'wait_for_approval') {
      this.onUpdateDeliveryClicked();
    }
  }
  onUpdateDeliveryClicked() {
    if (this.updateDelivery && this.delivery >= 0) {
      this.item.delivery = {
        ...this.item.delivery,
        _id: this.selectedDelivery || undefined,
        fee: this.delivery,
      };
      this.updateDelivery(this.item);
    }
  }
  onReviewSubmit() {
    this.reviewSubmit = true;
    this.submitReview({
      store: this.item?.store?._id || this.item?.store,
      invoice: this.item._id,
      productQuality: this.productQualityRating,
      sellerService: this.sellerServiceRating,
      deliveryService: this.deliveryServiceRating,
      comment: this.comment
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
