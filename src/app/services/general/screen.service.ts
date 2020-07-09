import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  isMobileSize: BehaviorSubject<boolean> = new BehaviorSubject(isPlatformBrowser(this.platformId) ? window.innerWidth < 992 : false);
  isMobileDevice: BehaviorSubject<boolean> = new BehaviorSubject(this.isMobileDeviceFunc());
  constructor(@Inject(PLATFORM_ID) private platformId) {

  }
  isMobileDeviceFunc() {
      var ua = navigator.userAgent;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  }
}
