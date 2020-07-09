import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMobileRoutingModule } from './merchant-mobile-routing.module';
import { MerchantMobileComponent } from '@components/mobile/merchant-mobile/merchant-mobile.component';
import { MerchantFooterComponent } from '@components/mobile/merchant-footer/merchant-footer.component';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [
    MerchantMobileComponent, 
    MerchantFooterComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantMobileRoutingModule
  ]
})
export class MerchantMobileModule { }
