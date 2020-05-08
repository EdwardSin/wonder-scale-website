import { Component } from '@angular/core';
import { CurrencyService } from '@services/general/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Currency } from '@objects/currency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wonder-scale-website';
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private currencyService: CurrencyService) {
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
  }
  scrollTo() {
    window.scrollTo(0, 0);
  }
}
