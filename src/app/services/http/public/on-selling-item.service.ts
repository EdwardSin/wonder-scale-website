import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthItemContributorUrl, ItemUrl } from '@enum/url.enum';
import { OnSellingItem } from '@objects/on-selling-item';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnSellingItemService {

  constructor(private http: HttpClient) { }
  
  getPreviewItemWithSellerById(id, storeId): Observable<Result<OnSellingItem>>{
    return this.http.get<Result<OnSellingItem>>(AuthItemContributorUrl.getPreviewItemWithSellerByIdUrl + '/' + id, { headers: { "access-store": storeId }});
  }
  getItemWithSellerById(id): Observable<Result<OnSellingItem>>{
    return this.http.get<Result<OnSellingItem>>(ItemUrl.getItemWithSellerByIdUrl + '/' + id);
  }
  getAllItemsByStoreId(id): Observable<Result<Array<OnSellingItem>>> {
    return this.http.get<Result<Array<OnSellingItem>>>(ItemUrl.getAllItemsByStoreIdUrl + '/' + id);
  }
  getNewItemsByStoreId(id): Observable<Result<Array<OnSellingItem>>> {
    return this.http.get<Result<Array<OnSellingItem>>>(ItemUrl.getNewItemsByStoreIdUrl + '/' + id);
  }
  getTodaySpecialItemsByStoreId(id): Observable<Result<Array<OnSellingItem>>> {
    return this.http.get<Result<Array<OnSellingItem>>>(ItemUrl.getTodaySpecialItemsByStoreIdUrl + '/' + id);
  }
  getItemsByCategoryId(categoryId): Observable<Result<Array<OnSellingItem>>> {
    return this.http.get<Result<Array<OnSellingItem>>>(ItemUrl.getItemsByCategoryIdUrl + '/' + categoryId);
  }
}
