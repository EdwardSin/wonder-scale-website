import { environment } from '@environments/environment';

declare var jQuery: any;

export class QRCodeBuilder{

    static URL = environment.URL;
    public static createQRcode(target, username, id, option = {}){
        let code = QRCodeBuilder.URL + username + '?id=' + id;
        (<any>jQuery(target)).qrcode({width: option['width'] || 196, height: option['height']|| 196, foreground:"#000", 
        correctLevel: 0, 
        text: code, 
        src: 'assets/images/png/icon-with-profile-image-borderless.png'
    })
    }
    public static createPromotionQrCode(target, url, option = {}){
        let code = QRCodeBuilder.URL + url;
        (<any>jQuery(target)).qrcode({width: option['width'] || 196, height: option['height']|| 196, foreground:"#000", 
        correctLevel: 0, 
        text: code, 
        src: 'assets/images/png/icon-with-profile-image-borderless.png'})
    }
}