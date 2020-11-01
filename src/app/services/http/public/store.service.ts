import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@objects/store';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }
  getPreviewStoreById(id): Observable<Result<Store>> {
    return this.http.get<Result<Store>>('/api/auth-stores/store-contributors/' + id, { headers: { "access-store": id }});
  }
  getStoreById(id): Observable<Result<Store>> {
    return this.http.get<Result<Store>>('/api/stores/' + id);
  }
  getStoreByUsername(username): Observable<Result<Store>> {
    return this.http.get<Result<Store>>('/api/stores/username/' + username);
  }
  getStoresByKeyword(keyword='', page='1', order='', orderBy='asc'): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>('/api/stores/search', {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getRecommandedStores(): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>('/api/stores/random');
  }
}
