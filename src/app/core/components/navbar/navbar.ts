import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../services/auth'; // Revisa que la ruta apunte a tu servicio real

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  public authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private router = inject(Router);

  public isMenuOpen = false;
  // Controla el menú desplegable del perfil de usuario en desktop
  public isProfileDropdownOpen = signal<boolean>(false); 
  public navLinks: any[] = [];
  
  get activeLang() {
    return this.translocoService.getActiveLang();
  }

  ngOnInit(): void {
    this.translocoService.selectTranslateObject('nav.links').subscribe(links => {
      if (links) {
        this.navLinks = Array.isArray(links) ? links : Object.values(links);
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen.update(value => !value);
  }

  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  logout() {
    this.isProfileDropdownOpen.set(false);
    this.isMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}