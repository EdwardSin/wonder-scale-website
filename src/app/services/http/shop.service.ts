import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shop } from '@objects/shop';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http: HttpClient) { }

  getShops() {
    return this.http.get('/api/shops');
  }
  getShopById(id): Observable<Result<Shop>> {
    return this.http.get<Result<Shop>>('/api/shops/' + id);
  }
}
