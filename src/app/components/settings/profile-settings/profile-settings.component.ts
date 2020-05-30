import { Component, OnInit } from '@angular/core';
import { User } from '@objects/user';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { SharedUserService } from '@services/shared/shared-user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DateBuilder } from '@builders/date.builder';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { FormGroup } from '@angular/forms';
import { TelValidator } from '@validations/user-validation/tel.validator';
import { GenderValidator } from '@validations/user-validation/gender.validator';
import { NameValidator } from '@validations/user-validation/name.validator';
import { EmailValidator } from '@validations/user-validation/email.validator';
import { DateOfBirthValidator } from '@validations/user-validation/dateofbirth.validator';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as moment from 'moment';
import { WsLoading } from '@elements/ws-loading/ws-loading';
declare var jQuery: any;
import * as $ from 'jquery';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  user: User;
  isProfileUploaderOpened: boolean;
  loading: WsLoading = new WsLoading;
  uploadLoading: WsLoading = new WsLoading;
  updateLoading: WsLoading = new WsLoading;
  environment = environment;
  previewImage;
  croppieObj;
  form: FormGroup;
  emailValidator = new EmailValidator;
  nameValidator = new NameValidator;
  genderValidator = new GenderValidator;
  telValidator = new TelValidator;
  dateOfBirthValidator = new DateOfBirthValidator;
  dateSelector = DateBuilder.getDateSelector();

  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authUserService: AuthUserService,
    private sharedUserService: SharedUserService,
    private sanitization: DomSanitizer) { 
      DocumentHelper.setWindowTitleWithWonderScale('Profile');
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
  removeProfileImage() {
    if(confirm('Are you sure to remove your profile image?')) {
      this.authUserService.removeProfileImage().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
        this.user.profileImage = environment.IMAGE_URL + 'upload/images/profile.png'
        this.sharedUserService.user.next(this.user);
      });
    }
  }
  fileChangeEvent(event) {
    let files = <Array<File>>event.target.files;
    for(let file of files) {
      this.previewImageFunc(file, (result) =>{
        result.url = this.sanitization.bypassSecurityTrustResourceUrl(result.url);
        this.previewImage = result.url;
        this.uploadImageModalChange();
      });
    }
    event.target.value = "";
  }
  previewImageFunc(file, callback) {
    let reader = new FileReader;
    reader.onload = function (e) {
        let img = {
          name: file['name'],
          file: file,
          url: URL.createObjectURL(file),
          type: 'blob',
          base64: reader.result
      };
      if(file['name'] && file['name'].split('.').length > 1){
          img['ext'] = file['name'].split('.').pop();
      }
      callback(img);
    }
    reader.readAsDataURL(file);
  }
  removePreviewImage() {
    this.previewImage = null;
    $('.croppie-container').remove();
  }
  async uploadImage() {
    let result = await this.croppieObj.result();
    this.uploadLoading.start();
    this.authUserService.editProfile({file: result}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.uploadLoading.stop())).subscribe(result => {
      this.user.profileImage = result['data'];
      this.sharedUserService.user.next(this.user);
      this.isProfileUploaderOpened = false;
      this.removePreviewImage();
    });
  }
  uploadImageModalChange() {
    $(() => {
      let Croppie = window['Croppie'];
      this.croppieObj = new Croppie(document.getElementById('id-preview-image'), { 
          zoom: 1,
          viewport: {
          width: 100, 
          height: 100, 
          type: 'circle' 
        }});
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
      this.updateLoading.start();
      this.authUserService.editGeneral(user).pipe(takeUntil(this.ngUnsubscribe),
      finalize(() => this.updateLoading.stop()))
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
    // else if (!this.telValidator.validate(telController)) {
    //   WsToastService.toastSubject.next({ content: this.telValidator.errors.tel, type: 'danger' });
    //   return;
    // }
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
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
