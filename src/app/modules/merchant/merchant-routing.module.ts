import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from '@components/merchant/merchant.component';


const routes: Routes = [{
  path: '',
  component: MerchantComponent
}, {
  path: 'cart-menu',
  loadChildren: () => import('../../modules/menu/menu.module').then(m => m.MenuModule)
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
