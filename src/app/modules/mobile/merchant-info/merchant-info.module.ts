import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantInfoRoutingModule } from './merchant-info-routing.module';
import { MerchantInfoComponent } from '@components/mobile/merchant-info/merchant-info.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [MerchantInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    MerchantInfoRoutingModule
  ]
})
export class MerchantInfoModule { }
