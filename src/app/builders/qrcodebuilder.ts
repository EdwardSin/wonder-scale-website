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
                width: option['width'] || 196, height: option['height'] || 196, foreground: option['color'] || "#000",
                correctLevel: 0,
                text: code,
                callback: function () {
                    if (option['callback']) {
                        option['callback']();
                    }
                    resolve();
                }
            });
        });
    }
    public static createPromotionQrCode(target, url, option = {}) {
        let code = QRCodeBuilder.URL + url;
        (<any>jQuery(target)).qrcode({
            width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
            correctLevel: 0,
            text: code,
            src: 'assets/images/svg/icon-with-profile-image-borderless.svg'
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
    static renderProfileImageToQrcode(target, image, size) {
        let canvas = $(target).find('canvas')[0];
        if (canvas) {
            let new_canvas = this.createHiDPICanvas(canvas, size, size, null);
            let context = (<HTMLCanvasElement>new_canvas).getContext('2d');
            let width = size / 3 * 55 / 70;
            let height = size / 3 * 55 / 70;
            let offsetInnerY = size / 3 * 6 / 70;
            let offsetX = size / 2 - width / 2;
            let offsetY = size / 2 - height / 2 - offsetInnerY;
            context.save();
            context.imageSmoothingEnabled = true;
            context.beginPath();
            context.arc(offsetX + width / 2, offsetY + width / 2, width / 2, 0, 2 * Math.PI);
            context.fill();
            context.clip();
            context.drawImage(image, offsetX, offsetY, width, height);
            context.restore();
            $(target).find('canvas')[0].replaceWith(new_canvas);
            this.createBorder(environment.QRCODE_BORDER, $(target).find('canvas')[0], size);
        }
    }
    static createBorder (src, targetCanvas, size) {
        let img = new Image();
        img.src = src;
        img.addEventListener('load', function () {
            let context = targetCanvas.getContext('2d');
            context.imageSmoothingEnabled = true
            context.drawImage(img, (size-size/3)/2, (size-size/3)/2, size/3, size/3)
        });
    }
    static PIXEL_RATIO() {
        var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx['webkitBackingStorePixelRatio'] ||
                ctx['mozBackingStorePixelRatio'] ||
                ctx['msBackingStorePixelRatio'] ||
                ctx['oBackingStorePixelRatio'] ||
                ctx['backingStorePixelRatio'] || 1;
        return dpr / bsr;
    }
    static createHiDPICanvas(canvas, w, h, ratio) {
        if (!ratio) { ratio = this.PIXEL_RATIO(); }
        ratio = 10;
        let new_canvas = document.createElement('canvas');
        new_canvas.width = w * ratio;
        new_canvas.height = h * ratio;
        new_canvas.style.width = w + "px";
        new_canvas.style.height = h + "px";
        let context = new_canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.drawImage(canvas, 0, 0);
        return new_canvas;
    }
}