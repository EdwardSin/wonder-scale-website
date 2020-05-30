import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedLoadingService {
  loading: Subject<Boolean> = new Subject;
  refreshPromotion: Subject<Boolean> = new Subject;

  screenLoading: Subject<{loading: boolean, label?: string}> = new Subject;
  constructor() { }
}
