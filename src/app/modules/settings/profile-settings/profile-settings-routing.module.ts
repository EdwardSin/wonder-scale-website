import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSettingsComponent } from '@components/settings/profile-settings/profile-settings.component';


const routes: Routes = [{
  path: '',
  component: ProfileSettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileSettingsRoutingModule { }
