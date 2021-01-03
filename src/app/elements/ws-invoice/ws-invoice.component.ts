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
  promotion;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  isDeliveryDetailsAvailable: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['item']) {
      this.notifyCalculation();
      this.isDeliveryDetailsAvailable = this._isDeliveryDetailsAvailable();
    }
  }
  ngOnInit(): void {
  }
  notifyCalculation() {
    let discountValue = 0;
    if (this.promotion) {
      discountValue = this.promotion;
    }
    if (this.item.delivery && this.item.delivery.fee) {
      this.delivery = +this.item.delivery.fee;
    }
    this.subtotal = _.sumBy(this.item.items, function (x) {
      return x.price * x.quantity;
    });
    this.discount = this.subtotal * discountValue / 100;
    this.total = this.delivery + this.subtotal * (100 - discountValue) / 100;
  }
  _isDeliveryDetailsAvailable() {
    return (this.item.delivery && this.item.delivery.etaDate) ||
            (this.item.customer && this.item.customer.firstName && this.item.customer.lastName) ||
            (this.item.customer && this.item.customer.phoneNumber) ||
            (this.item.customer && this.item.customer.address && this.item.customer.address.address && this.item.customer.address.state && this.item.customer.address.postcode);
  }
}
