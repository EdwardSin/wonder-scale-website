import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Shop } from '@objects/shop';

@Injectable({
  providedIn: 'root'
})
export class SharedShopService {
  shop: BehaviorSubject<Shop> = new BehaviorSubject<Shop>(null);
  constructor() { }
}
