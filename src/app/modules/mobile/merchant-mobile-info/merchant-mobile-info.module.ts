import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMobileInfoRoutingModule } from './merchant-mobile-info-routing.module';
import { MerchantMobileInfoComponent } from '@components/mobile/merchant-mobile-info/merchant-mobile-info.component';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [MerchantMobileInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantMobileInfoRoutingModule
  ]
})
export class MerchantMobileInfoModule { }
