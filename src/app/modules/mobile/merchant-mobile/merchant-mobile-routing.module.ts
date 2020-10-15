import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantMobileComponent } from '@components/mobile/merchant-mobile/merchant-mobile.component';


const routes: Routes = [{
  path: '',
  component: MerchantMobileComponent,
  children: [{
    path: '',
    redirectTo: 'info',
    pathMatch: 'full'
  }, {
    path: 'info',
    loadChildren: () => import ('../merchant-info/merchant-info.module').then(m => m.MerchantInfoModule)
  },
  {
    path: 'menu',
    loadChildren: () => import ('../ordering/merchant-menu/merchant-menu.module').then(m => m.MerchantMenuModule)
  },
  {
    path: 'share',
    loadChildren: () => import ('../merchant-share/merchant-share.module').then(m => m.MerchantShareModule)
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMobileRoutingModule { }
