import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IRegisterData {
  activityArea?: string;
  experienceLevel?: string;
  fullName?: string;
  state?: string;
  city?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private registerDataSubject = new BehaviorSubject<IRegisterData>({});

  constructor() {
    const savedData = localStorage.getItem('registerData');

    if (savedData) {
      this.registerDataSubject.next(JSON.parse(savedData));
    }
  }

  updateRegisterData(data: Partial<IRegisterData>): void {
    const currentData = this.registerDataSubject.value;
    const updatedData = {
      ...currentData,
      ...data,
    };

    this.registerDataSubject.next(updatedData);

    localStorage.setItem('registerData', JSON.stringify(updatedData));
  }

  getRegisterData(): IRegisterData {
    return this.registerDataSubject.value;
  }
}
