import { Routes } from '@angular/router';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { PersonalDataFormComponent } from './pages/personal-data-form/personal-data-form.component';
import { PerfilFormComponent } from './pages/perfil-form/perfil-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cadastro/area-atuacao', pathMatch: 'full' },
  { path: 'cadastro/area-atuacao', component: RegisterFormComponent },
  { path: 'cadastro/dados-pessoais', component: PersonalDataFormComponent },
  { path: 'cadastro/perfil', component: PerfilFormComponent },
];
