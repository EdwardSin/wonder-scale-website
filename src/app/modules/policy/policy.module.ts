import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { SharedModule } from '../public/shared/shared.module';
import { ElementModule } from '../public/element/element.module';
import { PolicyComponent } from '@components/policy/policy.component';


@NgModule({
  declarations: [PolicyComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    PolicyRoutingModule
  ]
})
export class PolicyModule { }
