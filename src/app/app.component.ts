import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Component, HostListener } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { ScreenService } from '@services/general/screen.service';
import SwiperCode, {Navigation, Pagination} from 'swiper/core';

SwiperCode.use([Navigation, Pagination]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wonder-scale-website';
  screenLoading: boolean;
  isMobileSize: boolean;
  loadingLabel: string = 'Loading...';
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(@Inject(PLATFORM_ID) private platformId,
    private screenService: ScreenService,
    private sharedLoadingService: SharedLoadingService) {
    let platform = isPlatformBrowser(this.platformId);
    this.sharedLoadingService.screenLoading.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.screenLoading = result.loading;
      this.loadingLabel = result.label;
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
  }
  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.screenService.isMobileSize.next(window.innerWidth < 992);
      this.screenService.isMobileDevice.next(this.screenService.isMobileDeviceFunc());
    }
  }
  scrollTo() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
