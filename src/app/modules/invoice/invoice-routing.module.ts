import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from '@components/invoice/invoice.component';
import { PreventRouteGuard } from '@guards/prevent-route.guard';


const routes: Routes = [{
  path: '',
  component: InvoiceComponent,
  canDeactivate: [PreventRouteGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
