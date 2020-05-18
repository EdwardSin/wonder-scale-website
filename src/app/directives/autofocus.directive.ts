import { Directive, ElementRef, Input } from '@angular/core';
import * as _ from 'lodash';

@Directive({
  selector: '[wsAutofocus]'
})
export class AutofocusDirective {
  @Input() isAutoFocus: boolean = true;
  constructor(private elementRef: ElementRef) { 
    _.delay(() => {
      if(this.isAutoFocus) {
        elementRef.nativeElement.focus();
      }
    }, 500);
  }

}
