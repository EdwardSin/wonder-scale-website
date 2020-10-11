import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@objects/store';

@Injectable({
  providedIn: 'root'
})
export class SharedStoreService {
  store: BehaviorSubject<Store> = new BehaviorSubject<Store>(null);
  constructor() { }
}
