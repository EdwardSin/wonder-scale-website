import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  placeorder(obj) {
    return this.http.post('/api/invoices/placeorder', obj);
  }
  getInvoiceById(id, receiptId) {
    return this.http.get('/api/invoices/?s_id=' + id + '&r_id=' + receiptId);
  }
  uploadPayslip(obj) {
    return this.http.post('/api/invoices/upload-payslip/' + obj._id, obj);
  }
}
