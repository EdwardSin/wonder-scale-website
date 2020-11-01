import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMenuRoutingModule } from './merchant-mobile-menu-routing.module';
import { MerchantMobileMenuComponent } from '@components/mobile/merchant-mobile-menu/merchant-mobile-menu.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { MenuItemComponent } from '@elements/menu-item/menu-item.component';
import { SharedMerchantModule } from 'src/app/modules/public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [MerchantMobileMenuComponent, MenuItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedMerchantModule,
    MerchantMenuRoutingModule
  ]
})
export class MerchantMobileMenuModule { }
