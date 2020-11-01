import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMobileShareRoutingModule } from './merchant-mobile-share-routing.module';
import { MerchantMobileShareComponent } from '@components/mobile/merchant-mobile-share/merchant-mobile-share.component';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [MerchantMobileShareComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantMobileShareRoutingModule
  ]
})
export class MerchantMobileShareModule { }
