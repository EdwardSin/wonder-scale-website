import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantInfoComponent } from '@components/mobile/merchant-info/merchant-info.component';


const routes: Routes = [{
  path: '',
  component: MerchantInfoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantInfoRoutingModule { }
