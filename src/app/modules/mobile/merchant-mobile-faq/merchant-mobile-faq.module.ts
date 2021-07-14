import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMobileFaqRoutingModule } from './merchant-mobile-faq-routing.module';
import { MerchantMobileFaqComponent } from '@components/mobile/merchant-mobile-faq/merchant-mobile-faq.component';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [MerchantMobileFaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantMobileFaqRoutingModule
  ]
})
export class MerchantMobileFaqModule { }
