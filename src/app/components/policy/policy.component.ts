import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  text;
  loading: WsLoading = new WsLoading();
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Policy');
    this.getPolicy();
  }
  getPolicy() {
    this.loading.start();
    this.http.get('/assets/html/policy.html', { responseType: 'text' }).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(text => {
        this.text = text;
        this.loading.stop();
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
