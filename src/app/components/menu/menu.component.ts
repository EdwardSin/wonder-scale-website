import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { SharedCartService } from '@services/shared/shared-cart.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { SharedStoreService } from '@services/shared-store.service';
import { OnSellingItemService } from '@services/http/public/on-selling-item.service';
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
import { AuthUserService } from '@services/http/general/auth-user.service';
import { AddressBookItem } from '@objects/address-book-item';
import { AddressBookValidator } from '@validations/addressbook-validation/addressbook.validator';

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
  addressLoading: WsLoading = new WsLoading;
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
  isModifyAddressModalOpened: boolean;
  isAddressModalOpened: boolean;
  form: FormGroup;
  modifyLoading: WsLoading = new WsLoading();
  selectedAddressItem: AddressBookItem;
  addressItems: Array<AddressBookItem> = [];
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private ref: ChangeDetectorRef, private router: Router, private route: ActivatedRoute,
    private sharedCartService: SharedCartService,
    private sharedStoreService: SharedStoreService,
    private invoiceService: InvoiceService,
    private authInvoiceService: AuthInvoiceService,
    private storeService: StoreService,
    private screenService: ScreenService,
    private authenticationService: AuthenticationService,
    private authUserService: AuthUserService,
    private onSellingItemService: OnSellingItemService) {
      
    this.sharedCartService.cartItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.allCartItems = result;
      this.cashier.cartItems = <CartItem[]>this.allCartItems;
      if (!result.length) {
        this.phase.setStep(0);
      }
    })
    
    let formBuilder = new FormBuilder;
    this.detailsForm = formBuilder.group({
      recipientName: ['', [Validators.required, Validators.maxLength(36)]],
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
      if (result && !this.saleLoading.isRunning()) {
        this.itemLoading.stop();
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  isItemInCart(item) {
    return this.allCartItems.filter(cartItem => {
      return cartItem.itemId == item._id;
    }).length > 0;
  }
  mapStore() {
    if (this.store) {
      this.allItems = this.store['allItems'];
      this.newItems = this.store['newItems'];
      // this.discountItems = this.store['discountItems'];
      // this.todaySpecialItems = this.store['todaySpecialItems'];
      this.categories = this.store['onSellingCategories'];
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
    // } else if (value == 'discount') {
    //   _.delay(() => {
    //     this.items = this.discountItems;
    //     this.itemLoading.stop();
    //     this.closeNavigation();
    //   }, 500);
    } else if (value == 'new') {
      _.delay(() => {
        this.items = this.newItems;
        this.itemLoading.stop();
        this.closeNavigation();
      }, 500);
    } else {
      this.onSellingItemService.getItemsByCategoryId(value)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.itemLoading.stop())).subscribe(result => {
          this.items = result.result;
          this.closeNavigation();
        });
    }
  }
  getAddressbook(isSetDefault=false) {
    this.addressLoading.start();
    this.authUserService.getAddressbook().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.addressLoading.stop())).subscribe(result => {
      this.addressItems = result['result'];
      if (isSetDefault) {
        this.selectedAddressItem = this.addressItems.find(item => {
          return item.isDefaultShipping;
        });
      }
    });
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
          this.getAddressbook(true);
        } else {
          this.router.navigate([], {queryParams: {modal: 'login'}, queryParamsHandling: 'merge'});
        }
      })
    }
  }
  placeorder() {
    this.detailsForm.patchValue({
      recipientName: this.selectedAddressItem?.recipientName,
      phoneNumber: this.selectedAddressItem?.phone,
      address: this.selectedAddressItem?.address,
      postcode: this.selectedAddressItem?.postcode,
      state: this.selectedAddressItem?.state,
      country: this.selectedAddressItem?.country
    });
    let form = this.detailsForm;
    if (!this.selectedAddressItem) {
      WsToastService.toastSubject.next({ content: 'Please add your shipping address!', type: 'danger'});
      return;
    }
    if (form.status == 'VALID' && this.allCartItems.length) {
      let items = this.allCartItems.map(item => {
        let name = item.name + (item?.type ? ' - ' + item?.type?.name : '');
        return {
          itemId: item.itemId,
          name,
          profileImage: item.profileImage,
          quantity: item.quantity,
          price: item.amount(),
          subItems: item.subItems,
          type: item.type ? item.type.name : null
        }
      });
      let obj = {
        recipientName: this.detailsForm.value.recipientName.trim(),
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
  onAddToCartClicked(event) {
      this.sharedCartService.addCartItem(event);
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
  openModifyAddressItemModal() {
    this.isModifyAddressModalOpened = true;
    this.createForm();
  }
  createForm() {
    let formBuilder = new FormBuilder();
    this.form = formBuilder.group({
      recipientName: [''],
      phone: [''],
      address: [''],
      postcode: [''],
      state: [''],
      country: ['MYS'],
      from: ['home'],
      isDefaultBilling: [false],
      isDefaultShipping: [false]
    });
  }
  saveAddress() {
    let obj: AddressBookItem = {
      recipientName: this.form.value.recipientName,
      phone: this.form.value.phone,
      address: this.form.value.address,
      postcode: this.form.value.postcode,
      state: this.form.value.state,
      country: this.form.value.country,
      from: this.form.value.from,
      isDefaultBilling: false,
      isDefaultShipping: false
    }
    let addressbookValidator = new AddressBookValidator(this.form);
    if (addressbookValidator.validate()) {
      this.modifyLoading.start();
      this.authUserService.saveAddress(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.getAddressbook();
        this.selectedAddressItem = result['data'];
        this.isModifyAddressModalOpened = false;
        this.isAddressModalOpened = false;
      }, error => {
        if (error?.status == '403' || error?.status == '400') {
          WsToastService.toastSubject.next({ content: error?.error, type: 'danger'});
        }
      });
    }
  }
  ngOnDestroy() {
    this.sharedCartService.cartItems.next([]);
  }
}
