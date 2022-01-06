import { Validator, NG_VALIDATORS, FormControl, ValidationErrors, AbstractControl } from "@angular/forms";
import { Directive, OnInit, forwardRef } from "@angular/core";

@Directive({
	selector: "[validPhoneNumber]",
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: PhoneNumberValidatorDirective,
			multi: true,
		},
	],
})
export class PhoneNumberValidatorDirective implements Validator {

	phonePattern = new RegExp(
		"^[(][0-9]{3}[)][ ][0-9]{3}[-]?[0-9]{4}(,,[0-9],,[0-9],[0-9])?$",
		"im"
	);

	validate(c: FormControl): ValidationErrors | null {


		if (c.value && !this.phonePattern.test(c.value)) {
			return { message: "Invalid phone number.<br>" };
		}

		return null;
	}
}
