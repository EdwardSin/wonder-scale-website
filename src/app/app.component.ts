import { Component } from '@angular/core';
import { CurrencyService } from '@services/http/general/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Currency } from '@objects/currency';
import { SharedLoadingService } from '@services/shared/shared-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wonder-scale-website';
  screenLoading: boolean;
  loadingLabel: string = 'Loading...';
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private currencyService: CurrencyService,
    private sharedLoadingService: SharedLoadingService) {
    this.currencyService
      .getCurrency()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          let rates = result['rates'];
          this.currencyService.currencyRate.next(rates);
          this.currencyService.currencyFullnameArray.forEach(key => {
            let currency = new Currency();
            currency.code = key;
            currency.rate = rates[key];
            currency.symbol = this.currencyService.currencySymbols[key];
            currency.fullname = this.currencyService.currencyFullnames[key];
            this.currencyService.currencies.push(currency);
          })
        }
      });
    this.sharedLoadingService.screenLoading.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.screenLoading = result.loading;
      this.loadingLabel = result.label;
    });
  }
  scrollTo() {
    window.scrollTo(0, 0);
  }
}
