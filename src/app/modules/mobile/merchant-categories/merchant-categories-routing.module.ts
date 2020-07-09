import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantCategoriesComponent } from '@components/mobile/merchant-categories/merchant-categories.component';


const routes: Routes = [{
  path: '',
  component: MerchantCategoriesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantCategoriesRoutingModule { }
