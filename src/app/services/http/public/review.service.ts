import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  getReviews(obj) {
    return this.http.post(ReviewUrl.getReviewsUrl, obj);
  }
}
