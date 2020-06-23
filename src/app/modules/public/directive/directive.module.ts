import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectiveRoutingModule } from './directive-routing.module';
import { ClickoutsideDirective } from 'src/app/directives/clickoutside.directive';
import { AutofocusDirective } from 'src/app/directives/autofocus.directive';


@NgModule({
  declarations: [
    ClickoutsideDirective,
    AutofocusDirective
  ],
  imports: [
    CommonModule,
    DirectiveRoutingModule
  ],
  exports: [
    ClickoutsideDirective,
    AutofocusDirective
  ]
})
export class DirectiveModule { }
