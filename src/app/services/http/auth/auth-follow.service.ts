import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@objects/store';
import { Result } from '@objects/result';
import { Observable, of, from } from 'rxjs';
import { Item } from '@objects/item';
import { AuthenticationService } from '../general/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
    return this.http.get<Result<Array<Store>>>('/api/auth-users/users/follow/stores', {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getFollowItems(keyword = '', page = '1', order = '', orderBy = 'asc'): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/auth-users/users/follow/items', {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getFollowStoresByPosition(keyword = '', page = '1', order = '', orderBy = 'asc', latitude = '0', longitude = '0', radius = ''): Observable<Result<Array<Store>>> {
    return this.http.get<Result<Array<Store>>>('/api/auth-users/users/follow/stores/position', {
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
    return this.http.get<Result<Array<Store>>>('/api/auth-users/users/follow/items/position', {
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
    return this.isAuthenticatedWithObservableCallback(this.http.get<Result<Array<string>>>('/api/auth-users/users/follow-ids', { params: { type: 'store' } }), of(false));
  }
  getFollowItemsIds() {
    return this.isAuthenticatedWithObservableCallback(this.http.get<Result<Array<string>>>('/api/auth-users/users/follow-ids', { params: { type: 'item' } }), of(false));
  }
  isFollowedStore(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.get('/api/auth-users/users/is-following/' + id, { params: { type: 'store' } }), of(false));
  }
  isFollowedItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.get('/api/auth-users/users/is-following/' + id, { params: { type: 'item' } }), of(false));
  }
  followStore(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/follow/' + id, {}, { params: { type: 'store' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  followItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/follow/' + id, {}, { params: { type: 'item' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  unfollowStore(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/unfollow/' + id, {}, { params: { type: 'store' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  unfollowItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/unfollow/' + id, {}, { params: { type: 'item' } }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
}
