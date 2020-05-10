import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedUserService {
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() { }
}
