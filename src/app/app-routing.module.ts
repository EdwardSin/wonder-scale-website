import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { VisitorGuard } from './guards/visitor.guard';
import { AuthGuard } from './guards/auth.guard';
import { ComponentmoduleproxyComponent } from '@components/feature/proxy/componentmoduleproxy/componentmoduleproxy.component';


const routes: Routes = [{
  path: '',
  loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
}, {
  path: 'search',
  loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule)
}, {
  path: 'login',
  component: ComponentmoduleproxyComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal',
  children: [{
    path: '',
    loadChildren: () => import('./modules/authentication/login/login.module').then(m => m.LoginModule)
  }]
}, {
  path: 'activate/:token',
  component: ComponentmoduleproxyComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal',
  children: [{
    path: '',
    loadChildren: () => import('./modules/authentication/activate/activate.module').then(m => m.ActivateModule)
  }]
}, {
  path: 'register',
  component: ComponentmoduleproxyComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal',
  children: [{
    path: '',
    loadChildren: () => import('./modules/authentication/register/register.module').then(m => m.RegisterModule)
  }]
}, {
  path: 'forgot-password',
  component: ComponentmoduleproxyComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal',
  children: [{
    path: '',
    loadChildren: () => import('./modules/authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  }]
}, {
  path: 'reset-password/:token',
  component: ComponentmoduleproxyComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal',
  children: [{
    path: '',
    loadChildren: () => import('./modules/authentication/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  }]
}, {
  path: 'favorite',
  canActivate: [AuthGuard],
  loadChildren: () => import('./modules/favorite/favorite.module').then(m => m.FavoriteModule)
}, {
  path: 'page/:username',
  loadChildren: () => import('./modules/merchant/merchant.module').then(m => m.MerchantModule)
}, {
  path: 'item',
  component: ComponentmoduleproxyComponent,
  outlet: 'modal',
  children: [{
    path: '',
    loadChildren: () => import('./modules/list-item-info/list-item-info.module').then(m => m.ListItemInfoModule)
  }]
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
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
