import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shop } from '@objects/shop';
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
  getFollowShops(keyword = '', page = '1', order = '', orderBy = 'asc'): Observable<Result<Array<Shop>>> {
    return this.http.get<Result<Array<Shop>>>('/api/auth-users/users/follow/shops', {
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
  getFollowShopsByPosition(keyword = '', page = '1', order = '', orderBy = 'asc', latitude = '0', longitude = '0', radius = ''): Observable<Result<Array<Shop>>> {
    return this.http.get<Result<Array<Shop>>>('/api/auth-users/users/follow/shops/position', {
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
  getFollowItemsByPosition(keyword = '', page = '1', order = '', orderBy = 'asc', latitude = '0', longitude = '0', radius = '2,441'): Observable<Result<Array<Shop>>> {
    return this.http.get<Result<Array<Shop>>>('/api/auth-users/users/follow/items/position', {
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
  getFollowItemsIds() {
    return this.isAuthenticatedWithObservableCallback(this.http.get<Result<Array<string>>>('/api/auth-users/users/follow-ids', { params: { type: 'item' } }), of(false));
  }
  isFollowedShop(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.get('/api/auth-users/users/is-following/' + id, { params: { type: 'shop' } }), of(false));
  }
  isFollowedItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.get('/api/auth-users/users/is-following/' + id, { params: { type: 'item' } }), of(false));
  }
  followShop(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/follow/' + id, {}, { params: { type: 'shop' } }), of(false).pipe(tap(() => {
      this.router.navigate(['', { outlets: { modal: 'login'}}], {queryParamsHandling: 'merge'});
    })));
  }
  followItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/follow/' + id, {}, { params: { type: 'item' } }), of(false).pipe(tap(() => {
      this.router.navigate(['', { outlets: { modal: 'login'}}], {queryParamsHandling: 'merge'});
    })));
  }
  unfollowShop(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/unfollow/' + id, {}, { params: { type: 'shop' } }), of(false).pipe(tap(() => {
      this.router.navigate(['', { outlets: { modal: 'login'}}], {queryParamsHandling: 'merge'});
    })));
  }
  unfollowItem(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.put('/api/auth-users/users/unfollow/' + id, {}, { params: { type: 'item' } }), of(false).pipe(tap(() => {
      this.router.navigate(['', { outlets: { modal: 'login'}}], {queryParamsHandling: 'merge'});
    })));
  }
}
