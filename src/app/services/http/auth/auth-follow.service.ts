import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@objects/store';
import { Result } from '@objects/result';
import { Observable, of, from } from 'rxjs';
import { Item } from '@objects/item';
import { AuthenticationService } from '../general/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthUserUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthFollowService {
  constructor(private http: HttpClient, 
    private router: Router,
    private authenticationService: AuthenticationService) { }
  isAuthenticatedWithObservableCallback(isAuthenticatedCallFunc, unauthenticatedCallFunc) {
    return from(this.authenticationService.isAuthenticated()).pipe(switchMap((result) => {
      if (result) {
        return isAuthenticatedCallFunc;
      }
      else {
        return unauthenticatedCallFunc;
      }
    }));
  }
  getFollowStores(keyword = '', page = '1', order = '', orderBy = 'asc'): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>(AuthUserUrl.getFollowStoresUrl, {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getFollowItems(keyword = '', page = '1', order = '', orderBy = 'asc'): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>(AuthUserUrl.getFollowItemsUrl, {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getFollowStoresByPosition(keyword = '', page = '1', order = '', orderBy = 'asc', latitude = '0', longitude = '0', radius = ''): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>(AuthUserUrl.getFollowStoresByPositionUrl, {
      params: {
        keyword,
        page,
        order,
        orderBy,
        latitude,
        longitude,
        radius
      }
    });
  }
  getFollowItemsByPosition(keyword = '', page = '1', order = '', orderBy = 'asc', latitude = '0', longitude = '0', radius = '2,441'): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>(AuthUserUrl.getFollowItemsByPositionUrl, {
      params: {
        keyword,
        page,
        order,
        orderBy,
        latitude,
        longitude,
        radius
      }
    });
  }
  getFollowStoresIds() {
    return this.isAuthenticatedWithObservableCallback(this.http.get<Result<Array<string>>>(AuthUserUrl.getFollowStoreIdsUrl, { params: { type: 'store' } }), of(false));
  }
  getFollowItemsIds() {
    return this.isAuthenticatedWithObservableCallback(this.http.get<Result<Array<string>>>(AuthUserUrl.getFollowStoreIdsUrl, { params: { type: 'item' } }), of(false));
  }
  isFollowedStore(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.get(AuthUserUrl.isFollowStoreUrl + '/' + id, { params: { type: 'store' } }), of(false));
  }
  isFollowedItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.get(AuthUserUrl.isFollowStoreUrl + '/' + id, { params: { type: 'item' } }), of(false));
  }
  followStore(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put(AuthUserUrl.unfollowStoreUrl + '/' + id, {}, { params: { type: 'store' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  followItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put(AuthUserUrl.followItemUrl + '/' + id, {}, { params: { type: 'item' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  unfollowStore(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put(AuthUserUrl.unfollowStoreUrl + '/' + id, {}, { params: { type: 'store' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  unfollowItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put(AuthUserUrl.unfollowItemUrl + '/' + id, {}, { params: { type: 'item' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
}
