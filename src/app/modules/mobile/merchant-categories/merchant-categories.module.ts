import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantCategoriesRoutingModule } from './merchant-categories-routing.module';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';
import { MerchantCategoriesComponent } from '@components/mobile/merchant-categories/merchant-categories.component';


@NgModule({
  declarations: [MerchantCategoriesComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantCategoriesRoutingModule
  ]
})
export class MerchantCategoriesModule { }
