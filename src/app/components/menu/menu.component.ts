import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { SharedStoreService } from '@services/shared-store.service';
import { ItemService } from '@services/http/public/item.service';
import { Item } from '@objects/item';
import { Category } from '@objects/category';
import { environment } from '@environments/environment';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Store } from '@objects/store';
import * as _ from 'lodash';
import { Phase } from '@objects/phase';
import { Cashier } from '@objects/cashier';
import { CartItem } from '@objects/cart-item';
import { Router, ActivatedRoute } from '@angular/router';
import domtoimage from 'dom-to-image';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { StoreService } from '@services/http/public/store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '@services/http/public/invoice.service';
import { ScreenService } from '@services/general/screen.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { AuthInvoiceService } from '@services/http/auth/auth-invoice.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  s_id: string = '';
  r_id: string = '';
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
  store: Store;
  cashier: Cashier = new Cashier();
  regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  phase: Phase<Number> = new Phase(0, 3);
  sale;
  detailsForm: FormGroup;
  paymentFail: boolean;
  isMobileSize: boolean;
  downloading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private ref: ChangeDetectorRef, private router: Router, private route: ActivatedRoute,
    private sharedCartService: SharedCartService,
    private sharedStoreService: SharedStoreService,
    private invoiceService: InvoiceService,
    private authInvoiceService: AuthInvoiceService,
    private storeService: StoreService,
    private screenService: ScreenService,
    private authenticationService: AuthenticationService,
    private itemService: ItemService) {
      
    this.sharedCartService.cartItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.allCartItems = result;
      this.cashier.cartItems = <CartItem[]>this.allCartItems;
      if (!result.length) {
        this.phase.setStep(0);
      }
    })
    
    let formBuilder = new FormBuilder;
    this.detailsForm = formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(36)]],
      lastName: ['', [Validators.required, Validators.maxLength(36)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(36)]],
      deliveryOption: ['delivery', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(128)]],
      postcode: ['', [Validators.required, Validators.maxLength(36)]],
      state: ['', [Validators.required, Validators.maxLength(36)]],
      country: ['MYS', [Validators.required, Validators.maxLength(3)]],
      delivery: ['']
    })
  }
  ngOnInit(): void {
    this.itemLoading.start();
    window.scrollTo({ top: 0 });
    this.s_id = this.route.snapshot.queryParams['s_id'];
    this.r_id = this.route.snapshot.queryParams['r_id'];
    if (this.s_id && this.r_id) {
      this.saleLoading.start();
      this.invoiceService.getInvoiceById(this.s_id, this.r_id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.saleLoading.stop(); this.itemLoading.stop()})).subscribe(result => {
        if (result?.['result']?.['status'] == 'rejected') {
          let cartItems = result?.['result'].items.map(item => {
            let cartItem = new CartItem();
            cartItem.name = item.name;
            cartItem.itemId = item.itemId;
            cartItem.price = item.price;
            cartItem.quantity = item.quantity;
            cartItem.profileImage = item.profileImage;
            cartItem.discount = item.discount || 0;
            return cartItem;
          });
          this.detailsForm.patchValue({
            ...result?.['result']?.['customer'],
            ...result?.['result']?.['customer']?.['address']
          });
          this.sharedCartService.cartItems.next(cartItems);
          this.phase.setStep(1);
        }
      });
    }
    if (!this.sharedStoreService.store.value) {
      let username = this.route.snapshot.params.username;
      this.storeService.getStoreByUsername(username).subscribe(result => {
        this.sharedStoreService.store.next(result.result);
      });
    }
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        this.mapStore();
      }
      if (!this.saleLoading.isRunning()) {
        this.itemLoading.stop();
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  mapStore() {
    if (this.store) {
      this.allItems = this.store['allItems'];
      this.newItems = this.store['newItems'];
      this.discountItems = this.store['discountItems'];
      this.todaySpecialItems = this.store['todaySpecialItems'];
      this.categories = this.store['categories'];
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
  checkout() {
    this.phase.next();
    window.scrollTo(0, 0);
    this.ref.detectChanges();
  }
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
  backToCart() {
    this.phase.previous();
  }
  continueToDetails() {
    if (this.allCartItems.length) {
      this.authenticationService.isAuthenticated().then(result => {
        if (result) {
          this.phase.next();
        } else {
          this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
        }
      })
    }
  }
  placeorder() {
    let form = this.detailsForm;
    if (!form.value.firstName.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your first name!', type: 'danger'});
    }
    else if (!form.value.lastName.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your last name!', type: 'danger'});
    }
    else if (!form.value.phoneNumber.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your phone number!', type: 'danger'});
    }
    else if (!this.regex.test(form.value.phoneNumber.trim())) {
      return WsToastService.toastSubject.next({ content: 'Please enter a valid phone number!', type: 'danger'});
    }
    else if (!form.value.address.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your address!', type: 'danger'});
    }
    else if (!form.value.postcode.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your postcode!', type: 'danger'});
    }
    else if (!form.value.state.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your state!', type: 'danger'});
    }
    else if (!form.value.country.trim()) {
      return WsToastService.toastSubject.next({ content: 'Please enter your country!', type: 'danger'});
    }
    else if (form.status == 'VALID' && this.allCartItems.length) {
      let items = this.allCartItems.map(item => {
        let name = item.name + (item?.type ? ' - ' + item?.type?.name : '');
        return {
          itemId: item.itemId,
          name,
          profileImage: item.profileImage,
          quantity: item.quantity,
          price: item.amount(),
          type: item.type ? item.type.name : null
        }
      });
      let obj = {
        firstName: this.detailsForm.value.firstName.trim(),
        lastName: this.detailsForm.value.lastName.trim(),
        phoneNumber: this.detailsForm.value.phoneNumber.trim(),
        deliveryOption: this.detailsForm.value.deliveryOption,
        address: this.detailsForm.value.address.trim(),
        postcode: this.detailsForm.value.postcode.trim(),
        state: this.detailsForm.value.state.trim(),
        country: this.detailsForm.value.country.trim(),
        delivery: this.detailsForm.value.delivery === '' ? null : this.detailsForm.value.delivery,
        s_id: this.s_id,
        r_id: this.r_id,
        items,
        storeId: this.store._id
      };
      this.checkoutLoading.start();
      this.authInvoiceService.placeorder(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.checkoutLoading.stop())).subscribe(result => {
        if (result['result']) {
          let s_id = result['data'].s_id;
          let r_id = result['data'].r_id;
          this.router.navigate(['/invoice'], {queryParams: {s_id, r_id}});
        }
      }, err => {
        if (err?.status == '403') {
          WsToastService.toastSubject.next({ content: 'Seller is no longer receive order publicly!<br/>Please contact the seller for more information!', type: 'danger'});
        } else {
          WsToastService.toastSubject.next({ content: 'Order is not able to be placed!<br/>Please try again later!', type: 'danger'});
        }
      });
    }
    else {
      WsToastService.toastSubject.next({ content: 'There is an invalid input!<br/>Please correct it!', type: 'danger'});
    }
  }
  isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
  backToHome() {
    if (confirm('Are you sure to leave the page?')) {
      this.phase.setStep(0);
      this.router.navigate([], { queryParams: { s_id: null }, queryParamsHandling: 'merge' });
    }
  }
  navigateToStore() {
    this.router.navigate(['/page/mobile/' + this.store.username + '/info'], {queryParamsHandling: 'merge'});
  }

  openNavigation() {
    this.isNavigationOpened = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }
  closeNavigation() {
    this.isNavigationOpened = false;
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }
  ngOnDestroy() {
    this.sharedCartService.cartItems.next([]);
  }
}
