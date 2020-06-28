import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralSettingsRoutingModule } from './general-settings-routing.module';
import { GeneralSettingsComponent } from '@components/settings/general-settings/general-settings.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [GeneralSettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    GeneralSettingsRoutingModule
  ]
})
export class GeneralSettingsModule { }
