import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './components/merchant/merchant.component';
import { HomeComponent } from './components/home/home.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { SavedComponent } from './components/saved/saved.component';
import { ResetPasswordComponent } from '@components/feature/authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '@components/feature/authentication/forgot-password/forgot-password.component';
import { RegisterComponent } from '@components/feature/authentication/register/register.component';
import { ActivateComponent } from '@components/feature/authentication/activate/activate.component';
import { LoginComponent } from '@components/feature/authentication/login/login.component';
import { VisitorGuard } from './guards/visitor.guard';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'login',
  component: LoginComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal'
}, {
  path: 'activate/:token',
  component: ActivateComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal'
}, {
  path: 'register',
  component: RegisterComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal'
}, {
  path: 'forgot-password',
  component: ForgotPasswordComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal'
}, {
  path: 'reset-password/:token',
  component: ResetPasswordComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal'
}, {
  path: 'shops/:id',
  component: MerchantComponent
}, {
  path: 'items/:id',
  component: ItemInfoComponent
}, {
  path: 'saved',
  component: SavedComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
