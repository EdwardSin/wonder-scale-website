import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Result } from '@objects/result';
import { Sale } from '@objects/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  getSale(obj): Observable<Result<Array<Sale>>> {
    return this.http.get<Result<Array<Sale>>>('/api/sales', { params: obj });
  }
  checkout(obj) {
    return this.http.post('/api/sales/checkout', obj);
  }
  // addSale(obj) {
  //   return this.http.post('/api/sales', obj);
  // }
}
