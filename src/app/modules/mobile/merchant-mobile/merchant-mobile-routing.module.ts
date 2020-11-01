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
    loadChildren: () => import ('../merchant-mobile-info/merchant-mobile-info.module').then(m => m.MerchantMobileInfoModule)
  },
  {
    path: 'menu',
    loadChildren: () => import ('../ordering/merchant-mobile-menu/merchant-mobile-menu.module').then(m => m.MerchantMobileMenuModule)
  },
  {
    path: 'share',
    loadChildren: () => import ('../merchant-mobile-share/merchant-mobile-share.module').then(m => m.MerchantMobileShareModule)
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMobileRoutingModule { }
