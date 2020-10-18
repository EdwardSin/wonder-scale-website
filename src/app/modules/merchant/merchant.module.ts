import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from '@components/merchant/merchant.component';
import { SharedMerchantModule } from '../public/shared-merchant/shared-merchant.module';
import { SharedModule } from '../public/shared/shared.module';
import { MerchantPageComponent } from '@elements/merchant-page/merchant-page.component';


@NgModule({
  declarations: [MerchantComponent,
    MerchantPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
