import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(@Inject(PLATFORM_ID) private platformId) {

  }
  isMobileSize() {
    return isPlatformBrowser(this.platformId) ? window.innerWidth < 992 : false;
  }
}
