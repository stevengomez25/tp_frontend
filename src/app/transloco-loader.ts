import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    // Ahora environment.baseUrl tendrá el valor correcto
    return this.http.get<Translation>(`${environment.baseUrl}/i18n/${lang}.json`);
  }
}