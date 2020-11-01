import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Credit } from '@objects/credit';
import { AuthCreditContributorService } from '@services/http/auth-store/contributor/auth-credit-contributor.service';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CreditGuard implements CanActivate {

    constructor(private router: Router,
        private authStoreUserService: AuthStoreUserService,
        private authCreditContributorService: AuthCreditContributorService,
        private authenticationService: AuthenticationService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let type = route.queryParams.credit;
        return this.authCreditContributorService.getCredit(type).pipe(map((credit: Credit) => {
            if (credit && credit.left > 0) {
                return true;
            }
            else {
                this.router.navigate(['', { outlets: { modal: 'purchase' } }], { queryParams: { type } });
                return;
            }
        }))
    }
}
