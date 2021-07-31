import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthReviewUserUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthReviewService {

  constructor(private http: HttpClient) { }
  addReview(obj) {
    return this.http.post(AuthReviewUserUrl.addReviewUrl, obj);
  }
}
