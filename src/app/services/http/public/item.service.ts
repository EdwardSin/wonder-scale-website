import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '@objects/item';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }
  getPreviewItemWithSellerById(id, storeId): Observable<Result<Item>>{
    return this.http.get<Result<Item>>('/api/auth-stores/item-contributors/preview/item/' + id, { headers: { "access-store": storeId }});
  }
  getItemWithSellerById(id): Observable<Result<Item>>{
    return this.http.get<Result<Item>>('/api/items/item-with-seller/' + id);
  }
  getAllItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/items/public/all/' + id);
  }
  getNewItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/items/public/new/' + id);
  }
  getDiscountItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/items/public/discount/' + id);
  }
  getTodaySpecialItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/items/public/todayspecial/' + id);
  }
  getItemsByCategoryId(categoryId): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/items/public/' + categoryId);
  }
}

