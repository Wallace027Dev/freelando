import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService {
  private registeredEmails = [
    'usuario@example.com',
    'teste@example.com',
    'admin@example.com',
    'contato@example.com',
  ];

  verifyExistingEmail(email: string): Observable<boolean> {
    return of(
      this.registeredEmails.includes(
        email.toLocaleLowerCase()
      )
    ).pipe(delay(1500));
  }
}
