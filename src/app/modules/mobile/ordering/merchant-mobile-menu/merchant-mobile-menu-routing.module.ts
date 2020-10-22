import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantMobileMenuComponent } from '../../../../components/mobile/merchant-mobile-menu/merchant-mobile-menu.component';


const routes: Routes = [{
  path: '', component: MerchantMobileMenuComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMenuRoutingModule { }
