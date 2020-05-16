import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  isMobileSize: BehaviorSubject<boolean> = new BehaviorSubject(isPlatformBrowser(this.platformId) ? window.innerWidth < 992 : false);
  constructor(@Inject(PLATFORM_ID) private platformId) {

  }
}
