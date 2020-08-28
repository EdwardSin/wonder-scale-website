import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantMenuComponent } from '../../../../components/mobile/ordering/merchant-menu/merchant-menu.component';


const routes: Routes = [{
  path: '', component: MerchantMenuComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMenuRoutingModule { }
