import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecuritySettingsRoutingModule } from './security-settings-routing.module';
import { SharedModule } from '../../public/shared/shared.module';
import { SecuritySettingsComponent } from '@components/settings/security-settings/security-settings.component';


@NgModule({
  declarations: [SecuritySettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    SecuritySettingsRoutingModule
  ]
})
export class SecuritySettingsModule { }
