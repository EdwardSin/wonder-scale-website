import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { User } from '@objects/user';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { PasswordValidator } from '@validations/user-validation/password.validator';
import { FormGroup } from '@angular/forms';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent implements OnInit {
  user: User;
  form: FormGroup;
  loading: WsLoading = new WsLoading;
  passwordLoading: WsLoading = new WsLoading;
  passwordValidator = new PasswordValidator;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authUserService: AuthUserService) { 
    DocumentHelper.setWindowTitleWithWonderScale('Security');
    this.form = WSFormBuilder.createPasswordForm();
    this.getProfile();
  }

  ngOnInit(): void {
  }

  getProfile() {
    this.loading.start();
    this.authUserService.getProfile().pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.user = result.result;
      this.loading.stop();
    });
  }

  editPassword() {
    let obj = {
      oldPassword: this.form.value.oldPassword,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
    }
    if (this.isValidated()) {
      this.passwordLoading.start();
      this.authUserService.changePassword(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.passwordLoading.stop()))
      .subscribe(result => {
        this.form.reset();
        this.user.existsPassword = true;
        WsToastService.toastSubject.next({ content: 'Password is updated successfully!', type: 'success' });
      }, err => {
        this.form.reset();
        WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
      });
    }
  }

  isValidated() {
    let oldPasswordController = this.form.get('oldPassword');
    let passwordController = this.form.get('password');
    let confirmPasswordController = this.form.get('confirmPassword');
    if (!this.passwordValidator.validate(passwordController, confirmPasswordController, this.user.existsPassword ? oldPasswordController: null)) {
      if (this.passwordValidator.errors.password) {
        WsToastService.toastSubject.next({ content: this.passwordValidator.errors.password, type: 'danger' });
      }
      else {
        WsToastService.toastSubject.next({ content: this.passwordValidator.errors.confirmPassword, type: 'danger' });
      }
      return;
    }
    return true;
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  get password() { return this.form.get("password"); }
}
