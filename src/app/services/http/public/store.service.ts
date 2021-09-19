import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@objects/store';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';
import { StoreUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }
  getStoreByUsername(username): Observable<Result<Store>> {
    return this.http.get<Result<Store>>(StoreUrl.getStoreByUsernameUrl + '/' + username);
  }
  getStoresByKeyword(keyword='', page='1', order='', orderBy='asc'): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>(StoreUrl.getStoreByKeywordUrl, {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getRecommendedStores(): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>(StoreUrl.getRecommendedStoresUrl);
  }
}
