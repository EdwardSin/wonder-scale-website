import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shop } from '@objects/shop';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';
import { Item } from '@objects/item';

@Injectable({
  providedIn: 'root'
})
export class AuthFollowService {

  constructor(private http: HttpClient) { }
  getFollowShops(keyword='', page='1', order='', orderBy='asc'): Observable<Result<Array<Shop>>> {
    return this.http.get<Result<Array<Shop>>>('/api/auth-users/users/follow/shops', {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getFollowItems(keyword='', page='1', order='', orderBy='asc'): Observable<Result<Array<Item>>> {
    return this.http.get<Result<Array<Item>>>('/api/auth-users/users/follow/items', {
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getFollowShopsByPosition(keyword='', page='1', order='', orderBy='asc', latitude='0', longitude='0', radius=''): Observable<Result<Array<Shop>>> {
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
  getFollowItemsByPosition(keyword='', page='1', order='', orderBy='asc', latitude='0', longitude='0', radius='2,441'): Observable<Result<Array<Shop>>> {
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
  getFollowItemsIds(): Observable<Result<Array<string>>>{
    return this.http.get<Result<Array<string>>>('/api/auth-users/users/follow-ids', {
      params: {
        type: 'item'
      }
    });
  }
  isFollowedShop(id) {
    return this.http.get('/api/auth-users/users/is-following/' + id, {
      params: {
        type: 'shop'
      }
    });
  }
  isFollowedItem(id) {
    return this.http.get('/api/auth-users/users/is-following/' + id, {
      params: {
        type: 'item'
      }
    });
  }
  followShop(id) {
    return this.http.put('/api/auth-users/users/follow/' + id, {}, {
      params: {
        type: 'shop'
      }
    });
  }
  followItem(id) {
    return this.http.put('/api/auth-users/users/follow/' + id,  {}, {
      params: {
        type: 'item'
      }
    })
  }
  unfollowShop(id) {
    return this.http.put('/api/auth-users/users/unfollow/' + id, {}, {
      params: {
        type: 'shop'
      }
    });
  }
  unfollowItem(id) {
    return this.http.put('/api/auth-users/users/unfollow/' + id,  {}, {
      params: {
        type: 'item'
      }
    })
  }
}
