import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from '@components/menu/menu.component';
import { ElementModule } from '../public/element/element.module';
import { SharedMerchantModule } from '../public/shared-merchant/shared-merchant.module';


@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    SharedMerchantModule,
    ElementModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
