import { Routes } from '@angular/router';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { PersonalDataFormComponent } from './pages/personal-data-form/personal-data-form.component';
import { PerfilFormComponent } from './pages/perfil-form/perfil-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register/area-atuacao', pathMatch: 'full' },
  { path: 'register/area-atuacao', component: RegisterFormComponent },
  { path: 'cadastro/personal-data', component: PersonalDataFormComponent },
  { path: 'cadastro/perfil', component: PerfilFormComponent },
];
