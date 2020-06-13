import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var jQuery: any;
@Injectable({
    providedIn: 'root'
})
export class QRCodeBuilder {

    static URL = environment.URL;
    constructor(private http: HttpClient) {

    }
    public static createQRcode(target, url, option = {}) {
        let code = url;
        return new Promise((resolve) => {
            (<any>jQuery(target)).qrcode({
                width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
                correctLevel: 0,
                text: code,
                src: 'assets/images/png/icon-with-profile-image-borderless.png'
            });
            resolve();
        })
    }
    public static createPromotionQrCode(target, url, option = {}) {
        let code = QRCodeBuilder.URL + url;
        (<any>jQuery(target)).qrcode({
            width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
            correctLevel: 0,
            text: code,
            src: 'assets/images/png/icon-with-profile-image-borderless.png'
        })
    }
    toDataURL(url, callback) {
        this.http.get(url, { responseType: 'blob' }).subscribe(result => {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(result);
        });
    }
}