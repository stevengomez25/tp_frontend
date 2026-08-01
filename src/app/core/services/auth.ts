import { Injectable, Inject, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/auth`; 

  private _currentUser = signal<any | null>(null);
  public currentUser = computed(() => this._currentUser());
  public isAuthenticated = computed(() => !!this._currentUser());

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)){
      this.checkSession();
    }
  }

  /**
   * Intenta reconstruir la sesión si el token existe en el localStorage
   */
  private checkSession() {
    const token = this.getStoredToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const decodedToken = JSON.parse(payloadJson);

        // NUEVO: Validar si el token ya expiró
        // decodedToken.exp viene en segundos, Date.now() en milisegundos
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.warn('El token ha expirado. Limpiando sesión...');
          this.logout();
          return; // Detenemos la ejecución aquí
        }

        this._currentUser.set({
          id: decodedToken.userId || decodedToken.sub, 
          name: decodedToken.name || 'Usuario TempMail Pro',
          email: decodedToken.email || decodedToken.sub,
          organizationId: decodedToken.organizationId, 
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decodedToken.name || 'User')}`
        });
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.logout(); 
      }
    }
  }

  public login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  public signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/signup`, userData);
  }

  // REFACTORIZADO: Leer de localStorage de forma segura para SSR (Server-Side Rendering)
  private getStoredToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('token');
  }

  // REFACTORIZADO: Guardar en localStorage
  private setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.checkSession(); 
    }
  }

  // REFACTORIZADO: Limpiar localStorage al cerrar sesión
  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this._currentUser.set(null);
  } 
}