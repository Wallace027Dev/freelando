import { Validators } from '@angular/forms';
import { FormConfig } from 'app/shared/models/form-config.interface';
import { cpfValidator } from 'app/shared/validators/cpf.validator';
import { emailExistsValidator } from 'app/shared/validators/emailExists.validator';

export function getPersonalDataConfig(emailService: any): FormConfig {
  return {
    title: 'Crie seu cadastro',
    description:
      'Crie seu perfil gratuitamente para trabalhar com os melhores freelancers.',
    fields: [
      {
        label: 'Nome completo',
        formControlName: 'fullName',
        type: 'text',
        required: true,
        errorMessages: {
          required: 'Nome é obrigatório.',
          minLength: 'O nome deve ter pelo menos 3 caracteres.',
        },
        validators: [Validators.required, Validators.minLength(3)],
        width: 'full',
      },
      {
        label: 'CPF',
        formControlName: 'cpf',
        type: 'text',
        required: true,
        errorMessages: {
          required: 'CPF é obrigatório.',
          invalidCpf: 'CPF inválido.',
        },
        validators: [Validators.required, cpfValidator],
        width: 'full',
      },
      {
        label: 'Estado',
        formControlName: 'state',
        type: 'select',
        required: true,
        placeholder: 'Selecione',
        errorMessages: {
          required: 'Estado é obrigatório.',
        },
        validators: [Validators.required],
        width: 'half',
      },
      {
        label: 'Cidade',
        formControlName: 'city',
        type: 'select',
        required: true,
        placeholder: 'Selecione',
        errorMessages: {
          required: 'Cidade é obrigatório.',
        },
        validators: [Validators.required],
        width: 'half',
      },
      {
        label: 'Email',
        formControlName: 'email',
        type: 'email',
        required: true,
        errorMessages: {
          required: 'Email é obrigatório.',
          email: 'Email inválido.',
          emailExists: 'Email já cadastrado.',
        },
        validators: [Validators.required, Validators.email],
        AsyncValidators: [emailExistsValidator(emailService)],
        width: 'full',
      },
      {
        label: 'Senha',
        formControlName: 'password',
        type: 'password',
        required: true,
        errorMessages: {
          required: 'Senha é obrigatório.',
          minlength: 'Senha precisa ter pelo menos 6 caracteres.',
        },
        validators: [Validators.required, Validators.minLength(6)],
        width: 'half',
      },
      {
        label: 'Confirme a senha',
        formControlName: 'confirmPassword',
        type: 'password',
        required: true,
        errorMessages: {
          required: 'Senha é obrigatório.',
        },
        validators: [Validators.required],
        width: 'half',
      },
    ],
  };
}
