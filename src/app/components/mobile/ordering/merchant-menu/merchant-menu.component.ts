import { Component, OnInit, HostListener, ChangeDetectorRef, ElementRef } from '@angular/core';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { SharedShopService } from '@services/shared-shop.service';
import { SaleService } from '@services/http/public/sale.service';
import { ItemService } from '@services/http/public/item.service';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { environment } from '@environments/environment';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Shop } from '@objects/shop';
import * as _ from 'lodash';
import { Phase } from '@objects/phase';
import { Cashier } from '@objects/cashier';
import * as braintree from 'braintree-web';
import { CartItem } from '@objects/cart-item';
import { Router, ActivatedRoute } from '@angular/router';
import { TableService } from '@services/http/public/table.service';
import domtoimage from 'dom-to-image';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as $ from 'jquery';

@Component({
  selector: 'merchant-menu',
  templateUrl: './merchant-menu.component.html',
  styleUrls: ['./merchant-menu.component.scss']
})
export class MerchantMenuComponent implements OnInit {
  allCartItems: Array<CartItem> = [];
  environment = environment;
  items: Array<any> = [];
  allItems: Array<Item> = [];
  newItems: Array<Item> = [];
  todaySpecialItems: Array<Item> = [];
  discountItems: Array<Item> = [];
  categories: Array<Category> = [];
  selectedCategory: string = 'all';
  checkoutLoading: WsLoading = new WsLoading;
  itemLoading: WsLoading = new WsLoading;
  saleLoading: WsLoading = new WsLoading;
  isNavigationOpened: boolean;
  tableNo: string;
  tables;
  totalPersons: number = 1;
  shop: Shop;
  cashier: Cashier = new Cashier();

  phase: Phase<Number> = new Phase(0, 3);
  sale;
  paymentFail: boolean;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private ref: ChangeDetectorRef, private router: Router, private route: ActivatedRoute,
    private saleService: SaleService, private sharedCartService: SharedCartService,
    private sharedShopService: SharedShopService,
    private tableService: TableService,
    private itemService: ItemService) {
    this.sharedCartService.cartItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.allCartItems = result;
    })
  }
  @HostListener('window:beforeunload', ['$event'])
  canDeactivate($event: any): Observable<boolean> | boolean {
    if (confirm('Are you sure to leave the page?')) {
      this.phase.setStep(0);
    }
    return false;
  }
  ngOnInit(): void {
    this.itemLoading.start();
    window.scrollTo({ top: 0 });
    let shopId = this.route.snapshot.queryParams['id'];
    let saleId = this.route.snapshot.queryParams['s_id'];
    this.tableNo = this.route.snapshot.queryParams['tableNo'];
    if (saleId) {
      this.saleLoading.start();
      this.saleService.getSale({ shopId, saleId }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.saleLoading.stop(); this.itemLoading.stop(); })).subscribe(result => {
        this.phase.setStep(2);
        if (result && result.result) {
          this.sale = result.result;
          this.cashier.cartItems = this.sale.orders;
          this.cashier.discount = this.sale.discount;
          this.cashier.tax = this.sale.tax;
        }
      })
    }
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.shop = result;
        this.mapShop();
      }
      if (!this.saleLoading.isRunning()) {
        this.itemLoading.stop();
      }
    });
  }
  paymentDetail = {
    creditCard: {
      number: '',
      cvv: '',
      expirationDat: '',
      billingAddress: {
        postalCode: '',
      },
      options: {
        validate: false
      }
    }
  }
  ngAfterViewInit() {

    // braintree.client.create({
    //   authorization: environment.braintreeAuthorization
    // }, (err, clientInstance) => {
    //   console.log(clientInstance);
    //   clientInstance.request({
    //     endpoint: 'payment_methods/credit_cards',
    //     method: 'post',
    //     data: this.paymentDetail
    //   }, (err, res) => {
    //     if (err) {
    //       throw new Error(err);
    //     }
    //   })
    // });
    // this.submitBtn = document.getElementById('my-submit');
    // this.form = document.getElementById('my-sample-form');
    // braintree.client.create({
    //   authorization: environment.braintreeAuthorization
    // }, this.clientDidCreate.bind(this));
  }
  paymentInstance;
  createPaymentForm() {
    var authorization = environment.braintreeAuthorization;
    var me = this;

    braintree.client.create({
      authorization: authorization
    }, function (err, clientInstance) {
      if (err) {
        console.error(err);
        return;
      }
      createHostedFields(clientInstance);
    });

    function createHostedFields(clientInstance) {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '16px',
            'font-family': 'courier, monospace',
            'font-weight': 'lighter',
            'color': '#ccc'
          },
          ':focus': {
            'color': 'black'
          },
          '.valid': {
            'color': '#8bdda8'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '---- ---- ---- ----'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YYYY'
          },
          postalCode: {
            selector: '#postal-code',
            placeholder: '11111'
          }
        }
      }, function (err, instance) {
        if (err) {
          console.error(err);
          return;
        }

        me.paymentInstance = instance;
        // var teardown = function (event) {
        //   event.preventDefault();
        //   alert('Submit your nonce to your server here!');
        //   hostedFieldsInstance.teardown(function () {
        //     createHostedFields(clientInstance);
        //     form.removeEventListener('submit', teardown, false);
        //   });
        // };

        // form.addEventListener('submit', teardown, false);
      });
    }
  }
  mapShop() {
    if (this.shop) {
      this.allItems = this.shop['allItems'];
      this.newItems = this.shop['newItems'];
      this.discountItems = this.shop['discountItems'];
      this.todaySpecialItems = this.shop['todaySpecialItems'];
      this.categories = this.shop['categories'];
      this.items = this.allItems;
      this.ref.detectChanges();
    }
  }
  getItemsByCategoryId(value) {
    this.itemLoading.start();
    this.isNavigationOpened = false;
    this.selectedCategory = value;
    if (value == 'all') {
      _.delay(() => {
        this.items = this.allItems;
        this.itemLoading.stop()
        this.closeNavigation();
      }, 500);
    } else if (value == 'todayspecial') {
      _.delay(() => {
        this.items = this.todaySpecialItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else if (value == 'discount') {
      _.delay(() => {
        this.items = this.discountItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else if (value == 'new') {
      _.delay(() => {
        this.items = this.newItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else {
      this.itemService.getItemsByCategoryId(value)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
          this.items = result.result;
          this.closeNavigation();
        });
    }
  }
  removeCartItem(cartItem) {
    this.sharedCartService.removeCartItem(cartItem);
  }
  confirmPayment() {
    this.checkoutLoading.start();
    let instance = this.paymentInstance;
    instance.tokenize((tokenizeErr, payload) => {
      if (tokenizeErr) {
        console.error(tokenizeErr);
        this.checkoutLoading.stop();
        return;
      }
      let obj = {
        table: this.tableNo,
        totalPersons: this.totalPersons,
        shop: this.shop._id,
        discount: this.cashier.discount,
        tax: this.cashier.tax,
        orders: this.allCartItems,
        total: this.cashier.getTotal(),
        paymentMethodNonce: payload.nonce
      }

      this.saleService.checkout(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.checkoutLoading.stop())).subscribe(result => {
        if (result && result['result'] && result['result']['success']) {
          instance.teardown(function (teardownErr) {
            if (teardownErr) {
              console.error('Could not tear down the Hosted Fields form!');
            } else {
              console.info('Hosted Fields form has been torn down!');
            }
          });
          this.phase.next();
          window.scrollTo(0, 0);
          this.sale = result['data'];
          this.sharedCartService.cartItems.next([]);
          this.router.navigate([], {queryParams: { s_id: this.sale._id }, queryParamsHandling: 'merge'});
        } else {
            this.paymentFail = true;
            this.phase.next();
            window.scrollTo(0, 0);
        }
      });
    });
      // $.ajax({
      //   type: 'POST',
      //   url: '/api/sales/checkout',
      //   data: { 
      //     'paymentMethodNonce': payload.nonce,
      
      // }
    //   }).done(function (result) {
    //     // Tear down the Hosted Fields form
    //     console.log(result);
        
    //     me.checkoutLoading.stop();
    //     // if (result.success) {
    //     //   $('#checkout-message').html('<h1>Success</h1><p>Your Hosted Fields form is working! Check your <a href="https://sandbox.braintreegateway.com/login">sandbox Control Panel</a> for your test transactions.</p><p>Refresh to try another transaction.</p>');
    //     // } else {
    //     //   $('#checkout-message').html('<h1>Error</h1><p>Check your console.</p>');
    //     // }
    //   });
    
    // braintree.client.create({
    //   authorization: environment.braintreeAuthorization
    // }, (err, clientInstance) => {
    //   clientInstance.request({
    //     endpoint: '/api/sales/pay',
    //   method: 'post',
    //     data: this.paymentDetail
    //   }, (err, res) => {
    //     if (err) {
    //       throw new Error(err);
    //     }
    //   })
    // });
  }
  checkout() {
    this.phase.next();
    window.scrollTo(0, 0);
    this.cashier.cartItems = <CartItem[]>this.allCartItems;
    this.getTables();
    this.ref.detectChanges();
    this.createPaymentForm();
  }
  increaseTotalPersons() {
    if (this.totalPersons < 20) {
      this.totalPersons++;
    }
  }
  decreaseTotalPersons() {
    this.totalPersons--;
    if (this.totalPersons < 1) {
      this.totalPersons = 1;
    }
  }
  // shareReceipt() {
  //   if (navigator.share) {
  //     navigator.share({ 
  //       title: 'Receipt - ' + this.sale._id,
  //       text: 'Receipt - ' + this.sale._id,
  //       url: window.location.href
  //     })
  //     .then(() => console.log('Successful share'))
  //     .catch((err) => console.log(err));
  //   } else {
  //     WsToastService.toastSubject.next({ content: 'Browser doesn\'t support web share!', type: 'danger'});
  //   }
  // }
  downloading: WsLoading = new WsLoading;
  async downloadReceipt() {
    this.downloading.start();
    let dataUrl = await this.htmlToImage();
    let a = document.createElement('a');
    a.download = 'invoice - ' + this.sale._id;
    a.href = dataUrl;
    a.click();
    this.downloading.stop();
    WsToastService.toastSubject.next({ content: 'Receipt is downloaded successfully!', type: 'success' });
  }
  async htmlToImage() {
    try {
      let element = document.getElementsByClassName('invoice');
      if (element && element.length) {
        let dataUrl = await domtoimage.toPng(element[0]);
        return dataUrl;
      }
    } catch (err) {
      console.error('oops, comthing went wrong!', err);
    }
  }
  backToMenu() {
    this.phase.previous();
  }
  backToHome() {
    if (confirm('Are you sure to leave the page?')) {
      this.phase.setStep(0);
      this.router.navigate([], { queryParams: { s_id: null }, queryParamsHandling: 'merge' });
    }
  }
  getTables() {
    this.tableService.getTables(this.shop._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.tables = result['result'];
    });
  }

  openNavigation() {
    this.isNavigationOpened = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }
  closeNavigation() {
    this.isNavigationOpened = false;
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }
}
