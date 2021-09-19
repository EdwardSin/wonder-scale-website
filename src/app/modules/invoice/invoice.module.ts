import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from '@components/invoice/invoice.component';
import { WsInvoiceComponent } from '@elements/ws-invoice/ws-invoice.component';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [InvoiceComponent,
    WsInvoiceComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
