import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './components/merchant/merchant.component';
import { HomeComponent } from './components/home/home.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { SavedComponent } from './components/saved/saved.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'shop/:id',
  component: MerchantComponent
}, {
  path: 'item/:id',
  component: ItemInfoComponent
}, {
  path: 'saved',
  component: SavedComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
