import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectiveRoutingModule } from './directive-routing.module';
import { ClickoutsideDirective } from 'src/app/directives/clickoutside.directive';
import { AutofocusDirective } from 'src/app/directives/autofocus.directive';
import { DebounceClickDirective } from 'src/app/directives/debounce-click.directive';


@NgModule({
  declarations: [
    ClickoutsideDirective,
    DebounceClickDirective,
    AutofocusDirective
  ],
  imports: [
    CommonModule,
    DirectiveRoutingModule
  ],
  exports: [
    ClickoutsideDirective,
    DebounceClickDirective,
    AutofocusDirective
  ]
})
export class DirectiveModule { }
