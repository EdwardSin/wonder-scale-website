import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorGuard implements CanActivate {

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authenticationService.isAuthenticated().then(result => {
        if (result) {
          this.router.navigate([environment.RETURN_URL]);
          resolve(false);
        }
        else {
          resolve(true);
        }
      })
    });
  }
  canLoad() {
    return this.canActivate();
  }
}
