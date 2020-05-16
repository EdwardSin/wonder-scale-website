import { Component, OnInit } from '@angular/core';
import { SharedUserService } from '@services/shared/shared-user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@objects/user';
import { DateBuilder } from '@builders/date.builder';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { FormGroup } from '@angular/forms';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { TelValidator } from '@validations/user-validation/tel.validator';
import { GenderValidator } from '@validations/user-validation/gender.validator';
import { NameValidator } from '@validations/user-validation/name.validator';
import { EmailValidator } from '@validations/user-validation/email.validator';
import { DateOfBirthValidator } from '@validations/user-validation/dateofbirth.validator';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as moment from 'moment';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  user: User;
  form: FormGroup;
  emailValidator = new EmailValidator;
  nameValidator = new NameValidator;
  genderValidator = new GenderValidator;
  telValidator = new TelValidator;
  dateOfBirthValidator = new DateOfBirthValidator;
  dateSelector = DateBuilder.getDateSelector();
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authUserService: AuthUserService,
    private sharedUserService: SharedUserService) { 
    this.form = WSFormBuilder.createInfoForm();
    this.getProfile();
  }

  ngOnInit(): void {
  }
  getProfile() {
    this.loading.start();
    this.authUserService.getProfile().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.user = result.result;
      this.form.patchValue({...this.user});
      if (this.user.dateOfBirth) {
        let dateOfBirth = this.user.dateOfBirth;
        this.form.patchValue({
          date: moment(dateOfBirth).format('DD'), 
          month: moment(dateOfBirth).format('MMM'), 
          year: moment(dateOfBirth).year()
        })
      }
      this.loading.stop();
    });
  }

  editGeneralInfo() {
    let form = this.form;
    if (this.isValidated()) {
      let date = moment(form.value.date + "/" + form.value.month + "/" + form.value.year, 'DD/MMM/YYYY').toDate();
      let user: User = {
        _id: this.user._id,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        dateOfBirth: date,
        gender: form.value.gender,
        tel: form.value.tel,
        email: form.value.email,
        receiveInfo: form.value.receiveInfo ? true : false
      };
      this.authUserService.editGeneral(user).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        let user = result['result'];
        this.sharedUserService.user.next({
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,

        });
        WsToastService.toastSubject.next({ content: "Details are updated successfully!", type: 'success' });
      }, err => {
        console.log(err);
        WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
      });
    }
  }

  isValidated() {
    let emailController = this.form.get('email');
    let firstNameController = this.form.get('firstName');
    let lastNameController = this.form.get('lastName');
    let telController = this.form.get('tel');
    let genderController = this.form.get('gender');
    let dateController = this.form.get('date');
    let monthController = this.form.get('month');
    let yearController = this.form.get('year');

    if (!this.nameValidator.validate(firstNameController, lastNameController)) {
      if (this.nameValidator.errors.firstName) {
        WsToastService.toastSubject.next({ content: this.nameValidator.errors.firstName, type: 'danger' });
      }
      else {
        WsToastService.toastSubject.next({ content: this.nameValidator.errors.lastName, type: 'danger' });
      }
      return;
    }
    else if (!this.emailValidator.validate(emailController)) {
      WsToastService.toastSubject.next({ content: this.emailValidator.errors.email, type: 'danger' });
      return;
    }
    else if (!this.telValidator.validate(telController)) {
      WsToastService.toastSubject.next({ content: this.telValidator.errors.tel, type: 'danger' });
      return;
    }
    else if (!this.genderValidator.validate(genderController)) {
      WsToastService.toastSubject.next({ content: this.genderValidator.errors.gender, type: 'danger' });
      return;
    }
    else if (!this.dateOfBirthValidator.validate(dateController, monthController, yearController)) {
      WsToastService.toastSubject.next({ content: this.dateOfBirthValidator.errors.dateOfBirth, type: 'danger' });
      return;
    }
    return true;

  }

}
