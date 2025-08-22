import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const cpf = control.value.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { invalidCpf: true };
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let rest = sum % 11;
  let digitVerifier1 = rest < 2 ? 0 : 11 - rest;

  if (digitVerifier1 !== parseInt(cpf.charAt(9))) {
    return { invalidCpf: true };
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }

  rest = sum % 11;
  let digitVerifier2 = rest < 2 ? 0 : 11 - rest;

  if (digitVerifier2 !== parseInt(cpf.charAt(10))) {
    return { invalidCpf: true };
  }

  return null;
}
