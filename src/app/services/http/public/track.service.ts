import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateTimeHelper } from '../../../helpers/datetimehelper/datetime.helper';
import { TrackUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient) { }

  addTrack(obj) {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.post(TrackUrl.addTrackUrl + '?date=' + dateAsString, obj);
  }

}
