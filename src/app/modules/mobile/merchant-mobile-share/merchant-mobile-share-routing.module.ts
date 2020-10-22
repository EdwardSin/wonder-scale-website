import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantMobileShareComponent } from '@components/mobile/merchant-mobile-share/merchant-mobile-share.component';


const routes: Routes = [{
  path: '',
  component: MerchantMobileShareComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMobileShareRoutingModule { }
