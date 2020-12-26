import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { OrderReceiptService } from '@services/order-receipt.service';
import { interval, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  item;
  uploadingFiles = [];
  uploadLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private orderReceiptService: OrderReceiptService, private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    let _id = this.route.snapshot.queryParams['s_id'];
    let receiptId = this.route.snapshot.queryParams['r_id'];
    this.loading.start();
    if (_id && receiptId) {
      this.orderReceiptService.getOrderReceiptById(_id, receiptId).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
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
    interval(60 * 1000).pipe(switchMap(() => {return this.orderReceiptService.getOrderReceiptById(_id, receiptId)}),
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
      this.orderReceiptService.uploadPayslip(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.uploadLoading.stop())).subscribe(result => {
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
