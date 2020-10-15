import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemInfoComponent } from '@components/item-info/item-info.component';
import { ItemComponent } from '@elements/item/item.component';
import { SharedModule } from '../shared/shared.module';
import { SharedMerchantRoutingModule } from './shared-merchant-routing.module';


@NgModule({
  declarations: [
    ItemComponent,
    ItemInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantRoutingModule
  ],
  exports: [
    ItemComponent,
    ItemInfoComponent
  ]
})
export class SharedMerchantModule { }
