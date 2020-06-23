import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListItemInfoComponent } from '@components/list-item-info/list-item-info.component';


const routes: Routes = [{
  path: '',
  component: ListItemInfoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListItemInfoRoutingModule { }
