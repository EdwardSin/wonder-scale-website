import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthItemContributorUrl, ItemUrl } from '@enum/url.enum';
import { Item } from '@objects/item';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }
  getPreviewItemWithSellerById(id, storeId): Observable<Result<Item>>{
    return this.http.get<Result<Item>>(AuthItemContributorUrl.getPreviewItemWithSellerByIdUrl + '/' + id, { headers: { "access-store": storeId }});
  }
  getItemWithSellerById(id): Observable<Result<Item>>{
    return this.http.get<Result<Item>>(ItemUrl.getItemWithSellerByIdUrl + '/' + id);
  }
  getAllItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>(ItemUrl.getAllItemsByStoreIdUrl + '/' + id);
  }
  getNewItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>(ItemUrl.getNewItemsByStoreIdUrl + '/' + id);
  }
  getTodaySpecialItemsByStoreId(id): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>(ItemUrl.getTodaySpecialItemsByStoreIdUrl + '/' + id);
  }
  getItemsByCategoryId(categoryId): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>(ItemUrl.getItemsByCategoryIdUrl + '/' + categoryId);
  }
  getRecommendedProducts(): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>(ItemUrl.getRecommendedItemsUrl);
  }
}

