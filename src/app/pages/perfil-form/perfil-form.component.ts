import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { Skill } from 'app/shared/models/skill.interface';
import { Router } from '@angular/router';
import { RegisterService } from 'app/shared/services/register.service';
import { ChipComponent } from 'app/shared/components/chip/chip.component';
import { Language } from 'app/shared/models/language.interface';

@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ChipComponent],
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss'],
})
export class PerfilFormComponent implements OnInit {
  perfilForm!: FormGroup;
  photoPreview!: string | ArrayBuffer | null;

  skills: Skill[] = [
    { name: 'Fullstack', selected: false },
    { name: 'Front-end', selected: false },
    { name: 'React', selected: false },
    { name: 'Angular', selected: false },
  ];

  languageLevel: string[] = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo',
  ];

  languages: string[] = ['Português', 'Inglês', 'Espanhol'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.initializerForm();
  }

  onPrevious(): void {
    this.saveCurrentData();
    this.router.navigate(['/cadastro/personal-data']);
  }

  onNext(): void {
    if (this.perfilForm.valid) {
      this.saveCurrentData();
      this.router.navigate(['/cadastro/confirmacao']);
    }
  }

  onSelectedPhoto(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
        this.perfilForm.patchValue({ photo: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      this.photoPreview = null;
    }
  }

  toggleSkill(skill: Skill): void {
    skill.selected = !skill.selected;

    const selectedSkills = this.skills
      .filter((s) => s.selected)
      .map((s) => s.name);

    this.perfilForm.patchValue({ selectedSkills });
  }

  get languagesArray(): FormArray {
    return this.perfilForm.get('languages') as FormArray;
  }

  addLanguage(name: string = '', level: string = ''): void {
    const languageForm = this.fb.group({
      name: [name, Validators.required],
      level: [level, Validators.required],
    });

    this.languagesArray.push(languageForm);
  }

  removeLanguage(index: number): void {
    if (
      index === 0 &&
      this.languagesArray.at(0).get('name')?.value === 'Português'
    ) {
      return;
    }

    this.languagesArray.removeAt(index);
  }

  private initializerForm(): void {
    this.perfilForm = this.fb.group({
      photo: [''],
      summary: [''],
      selectedSkills: [[]],
      languages: this.fb.array([]),
      portfolio: [],
      linkedin: [''],
    });

    this.addLanguage('Português', 'Nativo');
  }

  private extractLanguages(): Language[] {
    return this.languagesArray.controls.map((control) => {
      return {
        nome: control.get('name')?.value,
        nivel: control.get('level')?.value,
      };
    });
  }

  private saveCurrentData(): void {
    const formValue = this.perfilForm.value;

    this.registerService.updateRegisterData({
      photo: this.photoPreview,
      summary: formValue.summary,
      selectedSkills: formValue.selectedSkills,
      languages: this.extractLanguages(),
      portfolio: formValue.portfolio,
      linkedin: formValue.linkedin,
    });
  }
}
