import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from '@components/merchant/merchant.component';
import { SharedModule } from '../public/shared/shared.module';
import { ItemComponent } from '@elements/item/item.component';
import { ItemInfoComponent } from '@components/item-info/item-info.component';
import { FloatBannerComponent } from '@elements/float-banner/float-banner.component';


@NgModule({
  declarations: [
    MerchantComponent,
    ItemComponent,
    ItemInfoComponent,
    FloatBannerComponent],
  imports: [
    CommonModule,
    SharedModule,
    MerchantRoutingModule
  ]
})
export class MerchantModule { }
