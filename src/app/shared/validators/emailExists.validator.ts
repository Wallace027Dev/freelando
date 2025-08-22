import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { EmailValidatorService } from '../services/email-validator.service';

export function emailExistsValidator(
  emailService: EmailValidatorService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return of(emailService.verifyExistingEmail(control.value)).pipe(
      map((exists) => (exists ? { emailExists: true } : null))
    );
  };
}
