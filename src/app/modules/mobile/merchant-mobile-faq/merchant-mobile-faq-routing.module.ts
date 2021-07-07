import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantMobileFaqComponent } from '@components/mobile/merchant-mobile-faq/merchant-mobile-faq.component';


const routes: Routes = [{
  path: '',
  component: MerchantMobileFaqComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantMobileFaqRoutingModule { }
