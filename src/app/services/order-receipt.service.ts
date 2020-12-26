import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderReceiptService {

  constructor(private http: HttpClient) { }

  getOrderReceiptById(id) {
    return this.http.get('/api/order-receipts/' + id);
  }
  uploadPayslip(obj) {
    return this.http.post('/api/order-receipts/upload-payslip/' + obj._id, obj);
  }
}
