import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantShareComponent } from '@components/mobile/merchant-share/merchant-share.component';


const routes: Routes = [{
  path: '',
  component: MerchantShareComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantShareRoutingModule { }
