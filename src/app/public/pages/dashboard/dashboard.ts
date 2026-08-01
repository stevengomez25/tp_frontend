import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth'; // Ajusta la ruta a tu servicio de auth
import { TemplateService } from '../../../core/services/template-sync'; // Tu servicio de sincronización

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private templateService = inject(TemplateService);
  private router = inject(Router);

  // 1. Obtenemos el usuario en tiempo real desde el Signal de autenticación
  public user = computed(() => this.authService.currentUser());

  // 2. Conectamos los datos del backend para las carpetas y carga
  public folders = this.templateService.folders;
  public isLoading = this.templateService.isLoading;

  constructor() {}
  // 3. Mapeamos dinámicamente las métricas del backend al formato que espera tu UI de tarjetas
  public stats = computed(() => {
    const s = this.templateService.stats();
    return [
      { 
        label: 'dashboard.stats.total', // Puedes meter esta clave en Transloco
        value: s ? s.totalTemplates.toString() : '0', 
        icon: 'fa-file-lines', 
        color: 'text-blue-600' 
      },
      { 
        label: 'dashboard.stats.folders', 
        value: s ? s.totalFolders.toString() : '0', 
        icon: 'fa-folder', 
        color: 'text-indigo-600' 
      },
      { 
        label: 'dashboard.stats.slots', 
        value: s ? `${s.slotsUsagePercentage}%` : '0%', 
        icon: 'fa-database', 
        color: 'text-emerald-500' 
      }
    ];
  });

  ngOnInit(): void {
    // Reutilizamos el estado. Si los signals están vacíos, jalamos del backend.
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.templateService.getFoldersAndTemplates().subscribe({
      error: (err) => console.error('Error cargando carpetas en dashboard:', err)
    });

    this.templateService.getTemplateStats().subscribe({
      error: (err) => console.error('Error cargando métricas en dashboard:', err)
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}