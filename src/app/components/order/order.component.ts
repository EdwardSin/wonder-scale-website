import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { environment } from '@environments/environment';
import { ScreenService } from '@services/general/screen.service';
import { AuthInvoiceService } from '@services/http/auth/auth-invoice.service';
import { Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  environment = environment;
  store;
  invoices;
  loading: WsLoading = new WsLoading;
  queryParams: any = {
    page: 1,
    selected: 'in_progress'
  };
  total = 0;
  isMobileSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private authInvoiceService: AuthInvoiceService,
    private screenService: ScreenService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getInvoices(this.queryParams);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.queryParams = {...this.queryParams, ...queryParams};
      this.getInvoices({page: queryParams.page, selected: queryParams.selected});
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }

  getInvoices(obj) {
    this.loading.start();
    this.authInvoiceService.getInvoices(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.invoices = result['result'];
      this.total = result['meta']['total'];
    });
  }
  unsaveInvoice(id) {
    this.authInvoiceService.unsaveInvoice(id).pipe(debounceTime(500), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.invoices = this.invoices.filter(invoice => invoice._id !== id);
    });
  }
  navigateToInvoice(invoice) {
    this.router.navigate(['/invoice'], {queryParams: {s_id: invoice._id, r_id: invoice.receiptId}});
  }
  navigateTo(obj) {
    this.router.navigate(['/order'], {queryParams: obj, queryParamsHandling: 'merge'});
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
