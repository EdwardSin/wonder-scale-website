import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipeRoutingModule } from './pipe-routing.module';
import { WsDiscountconverterPipe } from 'src/app/pipes/ws-discountconverter.pipe';
import { WsCurrencyPipe } from 'src/app/pipes/ws-currency.pipe';
import { WsLimitCtrlPipe } from 'src/app/pipes/ws-limit-ctrl.pipe';


@NgModule({
  declarations: [
    WsDiscountconverterPipe,
    WsCurrencyPipe,
    WsLimitCtrlPipe
  ],
  imports: [
    CommonModule,
    PipeRoutingModule
  ],
  exports: [
    WsDiscountconverterPipe,
    WsCurrencyPipe,
    WsLimitCtrlPipe
  ]
})
export class PipeModule { }
