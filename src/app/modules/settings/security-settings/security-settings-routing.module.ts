import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecuritySettingsComponent } from '@components/settings/security-settings/security-settings.component';


const routes: Routes = [{
  path: '',
  component: SecuritySettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecuritySettingsRoutingModule { }
