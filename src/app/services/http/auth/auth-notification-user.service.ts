import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthNotificationUserUrl } from '@enum/url.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthNotificationUserService {

  constructor(private _zone: NgZone, private http: HttpClient) { }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
  getNotificationStream() {
    return new Observable(observer => {
      const eventSource = this.getEventSource(AuthNotificationUserUrl.getNotificationStreamUrl);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };
      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      }
    });
  }
  getNotifications() {
    return this.http.get(AuthNotificationUserUrl.getNotificationsUrl + '/?from=website');
  }
  loadedNewNotifications(notifications) {
    return this.http.post(AuthNotificationUserUrl.loadedNewNotificationsUrl, { notifications });
  }
  readNotification(notificationId) {
    return this.http.post(AuthNotificationUserUrl.readNotificationUrl, {notificationId});
  }
}
