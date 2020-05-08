import { Component, OnInit, HostListener } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  didScroll: boolean;
  isShrink: boolean;
  changeHeaderOn: number = 200;
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  
  onScrollDown(event) {
    if (!this.didScroll){
      this.didScroll = true;
      setTimeout(() => {
        this.scrollPage()
      }, 300);
    }
  }
  scrollPage() {
    var sy = this.scrollY();
    this.isShrink = sy >= this.changeHeaderOn;
		this.didScroll = false;
  }
  scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
}