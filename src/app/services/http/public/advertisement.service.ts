import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdvertisementUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(private http: HttpClient) { }
  getAdvertisements(obj={types: ['pop-out', 'square', 'large', 'medium', 'small']}) {
    return this.http.post(AdvertisementUrl.getAdvertisementsUrl, obj);
  }
  viewAdvertisements(adsIds) {
    return this.http.post(AdvertisementUrl.viewAdvertisementUrl, {adsIds});
  }
  clickAdvertisement(id) {
    return this.http.post(AdvertisementUrl.clickAdvertisementUrl, {id});
  }
  getCurrentAdvertisement(arr, value) {
    value %= arr.length;
    return [...arr.slice(value, arr.length), ...arr.slice(0, value)];
  }
}
