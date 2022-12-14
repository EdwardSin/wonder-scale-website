import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [{
  path: '',
  loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
},
{
  path: 'search',
  loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule)
}, {
  path: 'favorite',
  canActivate: [AuthGuard],
  loadChildren: () => import('./modules/favorite/favorite.module').then(m => m.FavoriteModule)
}, {
  path: 'page/:username',
  loadChildren: () => import('./modules/merchant/merchant.module').then(m => m.MerchantModule)
}, {
  path: 'page/mobile/:username',
  loadChildren: () => import('./modules/mobile/merchant-mobile/merchant-mobile.module').then(m => m.MerchantMobileModule)
}, {
  //   path: 'items/:id',
  //   component: ItemInfoComponent
  // }, {
  path: 'settings',
  canActivate: [AuthGuard],
  loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
}, {
  path: 'invoice',
  loadChildren: () => import('./modules/invoice/invoice.module').then(m => m.InvoiceModule)
}, {
  path: 'order',
  loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule)
}, {
  path: 'policy',
  loadChildren: () => import('./modules/policy/policy.module').then(m => m.PolicyModule)
}, {
  path: '404',
  loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)
}, {
  path: '**',
  redirectTo: '404'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled', onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
