import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { Subject } from 'rxjs';
import { AddressBookItem } from '@objects/address-book-item';
import { finalize, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AddressBookValidator } from '@validations/addressbook-validation/addressbook.validator';

@Component({
  selector: 'address-book-settings',
  templateUrl: './address-book-settings.component.html',
  styleUrls: ['./address-book-settings.component.scss']
})
export class AddressBookSettingsComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  addressItems: Array<AddressBookItem> = [];
  isModifyAddressModalOpened: boolean;
  selectedAddressItem: AddressBookItem;
  form: FormGroup;
  loading: WsLoading = new WsLoading();
  modifyLoading: WsLoading = new WsLoading();
  constructor(private authUserService: AuthUserService) { }

  ngOnInit(): void {
    this.getAddressbook();
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
  getAddressbook() {
    this.loading.start();
    this.authUserService.getAddressbook().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.addressItems = result['result'];
    });
  }
  openModifyAddressItemModal(item) {
    this.isModifyAddressModalOpened = true;
    this.selectedAddressItem = item;
    if (item) {
      this.form.patchValue({
        ...this.selectedAddressItem
      });
    } else {
      this.createForm();
    }
  }
  saveAddress() {
    let obj: AddressBookItem = {
      _id: this.selectedAddressItem?._id,
      recipientName: this.form.value.recipientName,
      phone: this.form.value.phone,
      address: this.form.value.address,
      postcode: this.form.value.postcode,
      state: this.form.value.state,
      country: this.form.value.country,
      from: this.form.value.from,
      isDefaultBilling: this.form.value.isDefaultBilling,
      isDefaultShipping: this.form.value.isDefaultShipping
    }
    let addressbookValidator = new AddressBookValidator(this.form);
    if (addressbookValidator.validate()) {
      this.modifyLoading.start();
      this.authUserService.saveAddress(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.getAddressbook();
        this.isModifyAddressModalOpened = false;
      });
    }
  }
  removeAddress() {
    let _id = this.selectedAddressItem._id;
    if (this.selectedAddressItem.isDefaultBilling || this.selectedAddressItem.isDefaultShipping) {
      return WsToastService.toastSubject.next({ content: 'Sorry, default address is not able to removed!', type: 'danger'});
    }
    this.modifyLoading.start();
    this.authUserService.removeAddress(_id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
      this.addressItems = this.addressItems.filter(x => x._id !== _id);
      this.isModifyAddressModalOpened = false;
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
