import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from '@components/merchant/merchant.component';
import { SharedModule } from '../public/shared/shared.module';
import { SharedMerchantModule } from '../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [MerchantComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
