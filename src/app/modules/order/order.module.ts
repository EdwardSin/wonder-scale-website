import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from '@components/order/order.component';
import { SharedModule } from '../public/shared/shared.module';
import { ElementModule } from '../public/element/element.module';


@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    SharedModule,
    ElementModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
