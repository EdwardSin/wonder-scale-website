import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressBookSettingsComponent } from '@components/settings/address-book-settings/address-book-settings.component';


const routes: Routes = [{
  path: '',
  component: AddressBookSettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressBookSettingsRoutingModule { }
