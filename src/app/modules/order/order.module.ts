import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from '@components/order/order.component';
import { OrderReceiptComponent } from '@elements/order-receipt/order-receipt.component';
import { WsUploaderComponent } from '@elements/ws-uploader/ws-uploader.component';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [OrderComponent,
    OrderReceiptComponent,
    WsUploaderComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
