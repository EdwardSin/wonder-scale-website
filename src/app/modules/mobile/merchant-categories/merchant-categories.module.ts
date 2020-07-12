import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantCategoriesRoutingModule } from './merchant-categories-routing.module';
import { SharedModule } from '../../public/shared/shared.module';
import { SharedMerchantModule } from '../../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantCategoriesRoutingModule
  ]
})
export class MerchantCategoriesModule { }
