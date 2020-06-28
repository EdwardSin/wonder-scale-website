import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileSettingsRoutingModule } from './profile-settings-routing.module';
import { ProfileSettingsComponent } from '@components/settings/profile-settings/profile-settings.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [ProfileSettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProfileSettingsRoutingModule
  ]
})
export class ProfileSettingsModule { }
