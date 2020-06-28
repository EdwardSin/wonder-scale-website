import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  // Opera 8.0+
  // @ts-ignore
  public static isOpera = (!!window['opr'] && !!opr.addons) || !!window['opera'] || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  // @ts-ignore
  public static isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  // @ts-ignore
  public static isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  // Internet Explorer 6-11
  public static isIE = /*@cc_on!@*/false || !!document['documentMode'];

  // Edge 20+
  public static isEdge = !BrowserService.isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  public static isChrome = !!window['chrome'] && (!!window['chrome'].webstore || !!window['chrome'].runtime);

  // Edge (based on chromium) detection
  public static isEdgeChromium = BrowserService.isChrome && (navigator.userAgent.indexOf("Edg") != -1);

  // Blink engine detection
  public static isBlink = (BrowserService.isChrome || BrowserService.isOpera) && !!window.CSS;


  constructor() { }
}
