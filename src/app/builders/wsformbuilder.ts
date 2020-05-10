import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { DateValidation } from "../validations/validators/datevalidation";
import { GenderValidation } from "../validations/validators/gendervalidation";
import { PasswordValidation } from './../validations/validators/passwordvalidation';


export class WSFormBuilder {

    public static createPasswordForm(): FormGroup {
        let formBuilder = new FormBuilder();
        return formBuilder.group(
            {
                oldPassword: ['', Validators.minLength(8)],
                password: ['', [Validators.minLength(8),
                Validators.required,
                PasswordValidation.PasswordPattern]],
                confirmPassword: ['']
            },
            { validator: [PasswordValidation.MatchPassword] }
        );
    }
    public static createResetPasswordForm(): FormGroup {
        let formBuilder = new FormBuilder();
        return formBuilder.group(
            {
                password: ['', [Validators.minLength(8), Validators.required, PasswordValidation.PasswordPattern]],
                confirmPassword: ['']
            },
            {
                validators: [PasswordValidation.MatchPassword]
            }
        );
    }

    public static createInfoForm(): FormGroup {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            email: ["", [Validators.required, Validators.email, Validators.maxLength(30)]],
            firstName: ["", [Validators.required, Validators.maxLength(40)]],
            lastName: ["", [Validators.required, Validators.maxLength(40)]],
            username: ["", [Validators.required, Validators.maxLength(30)]],
            tel: ["", [Validators.required, Validators.maxLength(20)]],
            gender: ["", [Validators.required, GenderValidation.Valid]],
            // passwordGroup: formBuilder.group(
            //     {
            //         password: ["", [Validators.required, Validators.minLength(8),
            //         PasswordValidation.PasswordPattern]],
            //         confirmPassword: [""],
            //     },
            //     { validator: [PasswordValidation.MatchPassword] }
            // ),
            date: [""],
            month: [""],
            year: [""],
            // receiveInfo: [true],

            validator: DateValidation.Valid
        });
    }

    public static createLoginForm(): FormGroup {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            email: ["", [Validators.email, Validators.required]],
            password: ["", [Validators.required]]
        });
    }

    public static createForgetPasswordForm(): FormGroup {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            email: ["", [Validators.email, Validators.required]]
        });
    }

    public static createRegisterForm(): FormGroup {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            email: ["", [Validators.required, Validators.email, Validators.maxLength(30)]],
            firstName: ["", [Validators.required, Validators.maxLength(40)]],
            lastName: ["", [Validators.required, Validators.maxLength(40)]],
            tel: ["", [Validators.required, Validators.maxLength(20)]],
            gender: ["", [Validators.required, GenderValidation.Valid]],
            passwordGroup: formBuilder.group({
                password: ["", [Validators.required, Validators.minLength(8),
                PasswordValidation.PasswordPattern]],
                confirmPassword: [""],
            },
                { validator: [PasswordValidation.MatchPassword] }
            ),
            date: [""],
            month: [""],
            year: [""],
            receiveInfo: [true],
            validator: DateValidation.Valid
        });
    }

    public static createShopForm() {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            type: ["", [Validators.required]],
            name: ["", [Validators.required, Validators.maxLength(50)]],
            username: ["", [Validators.required, Validators.maxLength(25)]],
            address: ["", [Validators.required, Validators.maxLength(60)]],
            currency: ["", [Validators.required]],
            postcode: ['', [Validators.required, Validators.maxLength(15)]],
            state: ["", [Validators.required, Validators.maxLength(20)]],
            country: ['', [Validators.required, Validators.maxLength(20)]],
            longitude: ['', [Validators.required]],
            latitude: ['', [Validators.required]],
            tel: [formBuilder.array([]), [Validators.maxLength(15)]],
            website: [formBuilder.array([]), [Validators.maxLength(30)]],
            email: [formBuilder.array([]), [Validators.email, Validators.maxLength(30)]],
            description: ['', [Validators.maxLength(300)]],
            tags: [formBuilder.array([])],
            profileImage: [''],
            operatingHourRadio: ['selected_hours'],
            openingHour: ['']
        });
    }
    public static createItemForm() {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            refId: ['', [Validators.required, Validators.maxLength(36)]],
            name: ['', [Validators.required, Validators.maxLength(128)]],
            currency: ['', [Validators.required]],
            price: ['', [Validators.required]],
            discount: ['', []],
            quantity: [''],
            weight: [''],
            categories: [[]],
            brand: ['', [Validators.maxLength(256)]],
            warranty: ['', [Validators.maxLength(256)]],
            description: ['', [Validators.maxLength(256)]],
            isEntityNew: [true, [Validators.required]],
            isInStock: [true, [Validators.required]],
            isPriceDisplayed: [false, [Validators.required]],
            isPublished: [false, Validators.required],
            isEcommerce: [false],
            isPickup: [false]
        })
    }
    public static createItemTypesGroup() {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            itemTypes: new FormArray([])
        })
    }
    public static createItemTypeForm() {
        let formBuilder = new FormBuilder();
        return formBuilder.group({
            _id: new FormControl(''),
            images: new FormControl([]),
            hexColor: new FormControl(''),
            sizes: new FormControl(['S', 'M', 'L']),
            quantity: new FormControl(''),
            price: new FormControl(''),
            discount: new FormControl(''),
            weight: new FormControl(''),
            isOpen: false
        });
    }
    public static createSettingForm() {
        let formBuilder = new FormBuilder;
        return formBuilder.group({
            isMarkedAsNew: [''],
            isInStock: [''],
            isPriceDisplayed: [''],
            isPublished: [''],
            isEcommerce: [''],
            isPickup: [''],
            defaultCurrency: ['']
        })
    }
    public static createOpeningInfoForm() {
        let formBuilder = new FormBuilder;
        return formBuilder.group({

        });
    }
}