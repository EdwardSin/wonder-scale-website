import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantMenuRoutingModule } from './merchant-menu-routing.module';
import { MerchantMenuComponent } from '@components/mobile/ordering/merchant-menu/merchant-menu.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { MenuItemComponent } from '@elements/menu-item/menu-item.component';


@NgModule({
  declarations: [MerchantMenuComponent, MenuItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    MerchantMenuRoutingModule
  ]
})
export class MerchantMenuModule { }
