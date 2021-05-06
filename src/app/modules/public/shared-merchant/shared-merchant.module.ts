import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemInfoComponent } from '@components/item-info/item-info.component';
import { ItemComponent } from '@elements/item/item.component';
import { SharedModule } from '../shared/shared.module';
import { SharedMerchantRoutingModule } from './shared-merchant-routing.module';
import { MerchantInfoComponent } from '@elements/mobile/merchant-info/merchant-info.component';
import { MerchantMenuComponent } from '@elements/mobile/merchant-menu/merchant-menu.component';
import { MerchantShareComponent } from '@elements/mobile/merchant-share/merchant-share.component';
import { MerchantFooterComponent } from '@elements/mobile/merchant-footer/merchant-footer.component';
import { MenuItemComponent } from '@elements/menu-item/menu-item.component';
import { MenuCartItemComponent } from '@elements/menu-cart-item/menu-cart-item.component';


@NgModule({
  declarations: [
    ItemComponent,
    ItemInfoComponent,
    MerchantInfoComponent,
    MerchantMenuComponent,
    MerchantShareComponent,
    MerchantFooterComponent,
    MenuItemComponent,
    MenuCartItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantRoutingModule
  ],
  exports: [
    SharedModule,
    ItemComponent,
    ItemInfoComponent,
    MerchantInfoComponent,
    MerchantMenuComponent,
    MerchantShareComponent,
    MerchantFooterComponent,
    MenuItemComponent,
    MenuCartItemComponent
  ]
})
export class SharedMerchantModule { }
