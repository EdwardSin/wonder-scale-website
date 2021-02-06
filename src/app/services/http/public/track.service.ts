import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateTimeHelper } from '../../../helpers/datetimehelper/datetime.helper';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient) { }

  addTrack(obj) {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.post('/api/tracks?date=' + dateAsString, obj);
  }

}
