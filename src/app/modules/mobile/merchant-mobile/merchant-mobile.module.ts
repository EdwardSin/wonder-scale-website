import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMobileRoutingModule } from './merchant-mobile-routing.module';
import { MerchantMobileComponent } from '@components/mobile/merchant-mobile/merchant-mobile.component';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';
import { MerchantMobileFooterComponent } from '@components/mobile/merchant-mobile-footer/merchant-mobile-footer.component';


@NgModule({
  declarations: [
    MerchantMobileComponent,
    MerchantMobileFooterComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantMobileRoutingModule
  ]
})
export class MerchantMobileModule { }
