import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioOptionComponent } from '../../shared/components/radio-option/radio-option.component';
import { ExperienceLevelComponent } from '../../shared/components/experience-level/experience-level.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { RegisterService } from '../../shared/services/register.service';

const MODULES = [CommonModule, ReactiveFormsModule];
const COMPONENTS = [
  RadioOptionComponent,
  ExperienceLevelComponent,
  ButtonComponent,
];

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [...MODULES, ...COMPONENTS],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;

  activityAreas = [
    { id: 'ti', value: 'ti', label: 'TI e Programação' },
    { id: 'design', value: 'design', label: 'Design e Multimídia' },
    { id: 'revisao', value: 'revisao', label: 'Revisão' },
    { id: 'traducao', value: 'traducao', label: 'Tradução' },
    { id: 'transcricao', value: 'transcricao', label: 'Transcrição' },
    { id: 'marketing', value: 'marketing', label: 'Marketing' },
  ];

  experienceLevels = [
    {
      id: 'iniciante',
      label: 'Iniciante',
      description: '(1 a 3 anos)',
    },
    {
      id: 'intermediario',
      label: 'Intermediário',
      description: '(3 a 6 anos)',
    },
    {
      id: 'avancado',
      label: 'Avançado',
      description: '(6 anos ou mais)',
    },
  ];

  constructor(private fb: FormBuilder, private router: Router, private registerService: RegisterService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      activityAreas: ['', Validators.required],
      experienceLevel: ['', Validators.required],
    });
  }

  onAreaChange(area: string) {
    this.registerForm.get('activityAreas')?.setValue(area);
  }

  onLevelChange(level: string) {
    this.registerForm.get('experienceLevel')?.setValue(level);
  }

  onNext() {
    if (this.registerForm.valid) {
      this.registerService.updateRegisterData({
        activityArea: this.registerForm.get('activityAreas')?.value,
        experienceLevel: this.registerForm.get('experienceLevel')?.value,
      })

      this.router.navigate(['/cadastro/dados-pessoais']);
    }
  }

  onPrevious() {
    console.log('Etapa anterior');
  }
}
