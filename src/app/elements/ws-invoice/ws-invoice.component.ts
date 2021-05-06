import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() showDeliveryDetails;
  @Input() showStatusDetails;
  @Input() showStatusStepper = true;
  @Input() isSaveEnabled: boolean;
  @Input() isSaved: boolean;
  @Input() save: Function;
  @Input() unsave: Function;
  @Input() updateDelivery: Function;
  @Input() deliveries: Array<Delivery> = [];
  promotion;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  isDeliveryDetailsAvailable: boolean;
  etaDate;
  isShowStepper: boolean;
  selectedDelivery;
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
      this.selectedDelivery = this.item?.delivery?.fee;
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
    return (this.item.customer && this.item.customer.firstName && this.item.customer.lastName) ||
            (this.item.customer && this.item.customer.phoneNumber) ||
            (this.item.customer && this.item.customer.address && this.item.customer.address.address && this.item.customer.address.state && this.item.customer.address.postcode);
  }
  onDeliveryChange() {
    if (this.selectedDelivery == '') {
      this.delivery = 0;
    } else {
      this.delivery = this.selectedDelivery;
    }
    this.total = this.item.subtotal + this.delivery - this.discount;
  }
  onDeliveryInputChange(event) {
    this.total = this.item.subtotal + (+this.delivery) - this.discount;
  }
  onUpdateDeliveryClicked() {
    if (this.updateDelivery && this.delivery >= 0) {
      this.item.delivery = {
        ...this.item.delivery,
        fee: this.delivery,
      };
      this.updateDelivery(this.item);
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
