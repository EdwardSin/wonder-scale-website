import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivateRoutingModule } from './activate-routing.module';
import { ActivateComponent } from '@components/feature/authentication/activate/activate.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [ActivateComponent],
  imports: [
    CommonModule,
    SharedModule,
    ActivateRoutingModule
  ]
})
export class ActivateModule { }
