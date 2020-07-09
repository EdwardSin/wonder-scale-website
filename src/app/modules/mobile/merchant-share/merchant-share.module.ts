import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantShareRoutingModule } from './merchant-share-routing.module';
import { MerchantShareComponent } from '@components/mobile/merchant-share/merchant-share.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [MerchantShareComponent],
  imports: [
    CommonModule,
    SharedModule,
    MerchantShareRoutingModule
  ]
})
export class MerchantShareModule { }
