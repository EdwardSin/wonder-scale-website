import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@services/general/screen.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isMobileSize: boolean;
  isNavigationDisplayed: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private screenService: ScreenService, private router: Router) { 
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isMobileSize = result;
    });
    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isNavigationDisplayed = false;
        }
      });
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
