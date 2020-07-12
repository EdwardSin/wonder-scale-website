import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloatBannerComponent } from '@elements/float-banner/float-banner.component';
import { ItemInfoComponent } from '@components/item-info/item-info.component';
import { ItemComponent } from '@elements/item/item.component';
import { SharedModule } from '../shared/shared.module';
import { SharedMerchantRoutingModule } from './shared-merchant-routing.module';
import { MerchantCategoriesComponent } from '@components/mobile/merchant-categories/merchant-categories.component';


@NgModule({
  declarations: [
    ItemComponent,
    ItemInfoComponent,
    MerchantCategoriesComponent,
    FloatBannerComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantRoutingModule
  ],
  exports: [
    ItemComponent,
    ItemInfoComponent,
    MerchantCategoriesComponent,
    FloatBannerComponent
  ]
})
export class SharedMerchantModule { }
