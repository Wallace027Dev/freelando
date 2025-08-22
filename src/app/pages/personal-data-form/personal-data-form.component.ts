import { RegisterService } from './../../shared/services/register.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { IbgeService, ICity, IState } from 'app/shared/services/ibge.service';
import { cpfValidator } from 'app/shared/validators/cpf.validator';
import { emailExistsValidator } from 'app/shared/validators/emailExists.validator';
import { EmailValidatorService } from 'app/shared/services/email-validator.service';

export const passwordIsEqualValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsDontMatch: true };
  }

  return null;
};

@Component({
  selector: 'app-personal-data-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss'],
})
export class PersonalDataFormComponent implements OnInit {
  personalDataForm!: FormGroup;

  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;

  loadingCities$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private ibgeService: IbgeService,
    private emailService: EmailValidatorService
  ) {}

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = {
      validators: passwordIsEqualValidator,
    };

    this.personalDataForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        cpf: ['', [Validators.required, cpfValidator]],
        state: ['', Validators.required],
        city: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.email],
          [emailExistsValidator(this.emailService)],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      formOptions
    );

    this.loadStates$();
    this.configListenerStates();
  }

  onPrevious(): void {
    this.saveCurrentData();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onNext(): void {
    if (this.personalDataForm.valid) {
      this.saveCurrentData();
      this.router.navigate(['/cadastro/perfil']);
    } else {
      this.personalDataForm.markAllAsTouched();
    }
  }

  private loadStates$(): void {
    this.states$ = this.ibgeService.getStates();
  }

  private configListenerStates(): void {
    const stateControl = this.personalDataForm.get('state');

    if (stateControl) {
      this.cities$ = stateControl.valueChanges.pipe(
        startWith(''),
        tap(() => {
          this.resetCity();
          this.loadingCities$.next(true);
        }),
        switchMap((uf) => {
          if (uf) {
            return this.ibgeService
              .getCitiesPerState(uf)
              .pipe(tap(() => this.loadingCities$.next(false)));
          }

          this.loadingCities$.next(true);
          return of([]);
        })
      );
    }
  }

  private saveCurrentData(): void {
    const formValue = this.personalDataForm.value;

    this.registerService.updateRegisterData({
      fullName: formValue.fullName,
      state: formValue.state,
      city: formValue.city,
      email: formValue.email,
      password: formValue.password,
    });
  }

  private resetCity(): void {
    this.personalDataForm.get('city')?.reset();
    this.loadingCities$.next(true);
  }
}
