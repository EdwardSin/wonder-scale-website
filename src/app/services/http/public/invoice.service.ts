import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  getInvoiceById(id, receiptId) {
    return this.http.get(InvoiceUrl.getInvoiceByIdUrl + '/?s_id=' + id + '&r_id=' + receiptId);
  }
  uploadPayslip(obj) {
    return this.http.post(InvoiceUrl.uploadPayslipUrl + '/' + obj._id, obj);
  }
}
