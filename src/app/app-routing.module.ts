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
  //   path: 'items/:id',
  //   component: ItemInfoComponent
  // }, {
  path: 'settings',
  canActivate: [AuthGuard],
  loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
}, {
  path: '404',
  loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)
}, {
  path: '**',
  redirectTo: '404'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
