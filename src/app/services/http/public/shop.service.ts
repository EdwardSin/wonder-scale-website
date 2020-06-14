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
  getPreviewShopById(id): Observable<Result<Shop>> {
    return this.http.get<Result<Shop>>('/api/auth-shops/shop-contributors/' + id, { headers: { "access-shop": id }});
  }
  getShopById(id): Observable<Result<Shop>> {
    return this.http.get<Result<Shop>>('/api/shops/' + id);
  }
  getShopByUsername(username): Observable<Result<Shop>> {
    return this.http.get<Result<Shop>>('/api/shops/username/' + username);
  }
  getShopsByKeyword(keyword='', page='1', order='', orderBy='asc'): Observable<Result<Array<Shop>>> {
    return this.http.get<Result<Array<Shop>>>('/api/shops/search', {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getRecommandedShops(): Observable<Result<Array<Shop>>> {
    return this.http.get<Result<Array<Shop>>>('/api/shops/random');
  }
}
