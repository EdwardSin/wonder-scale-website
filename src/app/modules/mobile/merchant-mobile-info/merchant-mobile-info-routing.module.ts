import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantMobileInfoComponent } from '@components/mobile/merchant-mobile-info/merchant-mobile-info.component';


const routes: Routes = [{
  path: '',
  component: MerchantMobileInfoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMobileInfoRoutingModule { }
