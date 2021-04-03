import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

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
  @Input() isSaveEnabled: boolean;
  @Input() isSaved: boolean;
  @Input() save: Function;
  @Input() unsave: Function;
  promotion;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  isDeliveryDetailsAvailable: boolean;
  etaDate;
  isShowStepper: boolean;

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
}
