import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthenticationService } from '../general/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInvoiceService {

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
  getInvoices(obj) {
    return this.isAuthenticatedWithObservableCallback(this.http.get('/api/auth-users/invoice-users', {
      params: obj
    }), of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  placeorder(obj) {
    return this.isAuthenticatedWithObservableCallback(this.http.post('/api/auth-users/invoice-users/placeorder', obj) , of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  isSavedInvoice(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.post('/api/auth-users/invoice-users/is-saved', {id}) , of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  saveInvoice(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.post('/api/auth-users/invoice-users/save', {id}) , of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
  unsaveInvoice(id) {
    return this.isAuthenticatedWithObservableCallback(this.http.post('/api/auth-users/invoice-users/unsave', {id}) , of(false).pipe(tap(() => {
      this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
    })));
  }
}
