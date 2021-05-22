import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressBookSettingsRoutingModule } from './address-book-settings-routing.module';
import { AddressBookSettingsComponent } from '@components/settings/address-book-settings/address-book-settings.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [AddressBookSettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AddressBookSettingsRoutingModule
  ]
})
export class AddressBookSettingsModule { }
