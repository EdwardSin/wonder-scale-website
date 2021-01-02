import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { InvoiceService } from '@services/http/public/invoice.service';
import { interval, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  item;
  uploadingFiles = [];
  uploadLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute) { 
    this.loading.start();
  }

  ngOnInit(): void {
    let _id = this.route.snapshot.queryParams['s_id'];
    let receiptId = this.route.snapshot.queryParams['r_id'];
    if (_id && receiptId) {
      this.invoiceService.getInvoiceById(_id, receiptId).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
        if (result) {
          this.item = result['result'];
          this.refreshReceipt();
        }
      });
    } else {
      this.loading.stop();
    }
  }
  refreshReceipt() {
    let _id = this.route.snapshot.queryParams['s_id'];
    let receiptId = this.route.snapshot.queryParams['r_id'];
    interval(60 * 1000).pipe(switchMap(() => {return this.invoiceService.getInvoiceById(_id, receiptId)}),
    takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      if (result ) {
        this.item = result['result'];
      }
    });
  }
  fileChangeEvent(event) {
    event.forEach(item => {
      let exist = this.uploadingFiles.find(image => {
        return image.name == item.name && image.file.size == item.file.size;
      })
      if (!exist) {
        this.uploadingFiles.push(item);
      }
    });
  }
  uploadPayslip() {
    if (this.uploadingFiles.length) {
      let obj = {
        _id: this.item._id,
        file: this.uploadingFiles[0].base64
      }
      this.uploadLoading.start();
      this.invoiceService.uploadPayslip(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.uploadLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.item.status = 'paid';
          this.uploadingFiles = [];
          WsToastService.toastSubject.next({ content: 'It will take a moment for the confirmation!', type: 'success'});
        }
      });
    } else {
      WsToastService.toastSubject.next({ content: 'Please upload an image!', type: 'danger'});
    }
  }
}
