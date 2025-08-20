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
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { IbgeService, ICity, IState } from '../../shared/services/ibge.service';

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
    private ibgeService: IbgeService
  ) {}

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = {
      validators: passwordIsEqualValidator,
    };

    this.personalDataForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        state: ['', Validators.required],
        city: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
    this.router.navigate(['/register/area-atuacao']);
  }

  onNext(): void {
    if (this.personalDataForm.valid) {
      this.saveCurrentData();
      this.router.navigate(['/register/perfil']);
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
