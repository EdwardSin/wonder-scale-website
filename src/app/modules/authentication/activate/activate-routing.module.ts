import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateComponent } from '@components/feature/authentication/activate/activate.component';


const routes: Routes = [{ 
  path: '', 
  component: ActivateComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivateRoutingModule { }
