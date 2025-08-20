import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

export interface IState {
  id: number;
  sigla: string;
  nome: string;
}

export interface ICity {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class IbgeService {
  private readonly API_URL =
    'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) {}

  getStates(): Observable<IState[]> {
    return this.http
      .get<IState[]>(`${this.API_URL}/estados?orderBy=nome`)
      .pipe(retry(2));
  }

  getCitiesPerState(uf: string): Observable<ICity[]> {
    return this.http
      .get<ICity[]>(`${this.API_URL}/estados/${uf}/municipios?orderBy=nome`)
      .pipe(retry(2));
  }
}
