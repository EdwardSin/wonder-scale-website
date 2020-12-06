import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
declare let H: any;

@Injectable({
  providedIn: 'root'
})
export class WsGpsService {
  constructor(private http: HttpClient) { }


  getSuggestions(query) {
    return this.http.get(`https://photon.komoot.io/api/?q=${query}&limit=5`);
  }
  geocode(address, callback) {
    let platform = new H.service.Platform({
      app_id: environment.HERE_APP_API,
      app_code: environment.HERE_APP_CODE,
      useCIT: true,
      useHTTPS: true
    });
    let geocoder = platform.getGeocodingService();
    let geocodingParameters = {

      searchText: address.address,
      country: address.country,
      jsonattributes: 1
    };

    geocoder.geocode(geocodingParameters, onSuccess, onError);
    function onSuccess(result) {
      if (result.response && result.response.view) {
        let locations = result.response.view[0].result;
        let coords = {
          lat: locations[0].location.displayPosition.latitude,
          lng: locations[0].location.displayPosition.longitude
        };
        callback(coords);
      } else {
        console.log('location is not found!');
      }
    }
    function onError(error) {
      alert('Ooops!');
    }
  }
}
