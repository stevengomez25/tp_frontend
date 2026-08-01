import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './signup.html'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  public signupForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, Validators.requiredTrue]
  });

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // 1. Iniciamos el proceso de registro
    this.authService.signup(this.signupForm.value).subscribe({
      next: (response) => {
        console.log('Registro exitoso. Iniciando sesión automáticamente...');
        
        // 2. Extraemos las credenciales recién validadas
        const { email, password } = this.signupForm.value;

        // 3. Ejecutamos el login inmediatamente
        this.authService.login({ email, password }).subscribe({
          next: (loginResponse) => {
            console.log('Autenticación exitosa, redirigiendo al onboarding...');
            this.isLoading = false;
            // 4. Redirección final al componente de bienvenida/planes
            this.router.navigate(['/getting-started']);
          },
          error: (loginErr) => {
            // Manejo por si el registro funciona pero el token/login falla
            this.isLoading = false;
            console.error('Error en auto-login:', loginErr);
            this.errorMessage = 'Cuenta creada con éxito, pero hubo un problema al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.';
            
            // Opcional: podrías redirigir al login en este caso atípico
            // this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en registro:', err);
        this.errorMessage = err.error?.message || 'No se pudo completar el registro. El correo podría estar en uso.';
      }
    });
  }
}