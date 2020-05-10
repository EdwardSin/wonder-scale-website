import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@objects/category';
import { Result } from '@objects/result';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  getCategoriesByShopId(id): Observable<Result<Array<Category>>> {
    return this.http.get<Result<Array<Category>>>('/api/categories/shopid/' + id);
  }
}
