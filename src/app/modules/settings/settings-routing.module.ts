import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@components/settings/settings.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children:
      [{ path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', loadChildren: () => import('./profile-settings/profile-settings.module').then(m => m.ProfileSettingsModule) },
      { path: 'address-book', loadChildren: () => import('./address-book-settings/address-book-settings.module').then(m => m.AddressBookSettingsModule) },
      { path: 'general', loadChildren: () => import('./general-settings/general-settings.module').then(m => m.GeneralSettingsModule) },
      { path: 'security', loadChildren: () => import('./security-settings/security-settings.module').then(m => m.SecuritySettingsModule) }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
