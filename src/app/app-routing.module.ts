import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './components/merchant/merchant.component';
import { HomeComponent } from './components/home/home.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { ResetPasswordComponent } from '@components/feature/authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '@components/feature/authentication/forgot-password/forgot-password.component';
import { RegisterComponent } from '@components/feature/authentication/register/register.component';
import { ActivateComponent } from '@components/feature/authentication/activate/activate.component';
import { LoginComponent } from '@components/feature/authentication/login/login.component';
import { VisitorGuard } from './guards/visitor.guard';
import { FavoriteComponent } from '@components/favorite/favorite.component';
import { AuthGuard } from './guards/auth.guard';
import { SettingsComponent } from '@components/settings/settings.component';
import { ProfileSettingsComponent } from '@components/settings/profile-settings/profile-settings.component';
import { GeneralSettingsComponent } from '@components/settings/general-settings/general-settings.component';
import { SecuritySettingsComponent } from '@components/settings/security-settings/security-settings.component';
import { SearchComponent } from '@components/search/search.component';
import { ListItemInfoComponent } from '@components/list-item-info/list-item-info.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'search',
  component: SearchComponent
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
  path: 'favorite',
  component: FavoriteComponent,
  canActivate: [AuthGuard]
}, {
  path: 'shop',
  component: MerchantComponent
}, {
  path: 'item',
  component: ListItemInfoComponent,
  outlet: 'modal'
}, {
  path: 'items/:id',
  component: ItemInfoComponent
}, {
  path: 'settings',
  component: SettingsComponent,
  canActivate: [AuthGuard],
  children: [
    {path: '', redirectTo: 'profile', pathMatch: 'full'},
    {path: 'profile', component: ProfileSettingsComponent},
    {path: 'general', component: GeneralSettingsComponent},
    {path: 'security', component: SecuritySettingsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
