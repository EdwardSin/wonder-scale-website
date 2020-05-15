import { Directive, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickoutsideDirective {
  @Output()
  public clickOutside = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  @HostListener('window:click', ['$event.target'])
  public onClick(targetElement){
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if(!clickedInside){
      this.clickOutside.emit(null);
    }
  }
}
