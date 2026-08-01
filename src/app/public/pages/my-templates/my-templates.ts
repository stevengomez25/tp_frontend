import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Folder, TemplateService } from '../../../core/services/template-sync'; // Ajusta tu ruta

@Component({
  selector: 'app-my-templates',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslocoModule],
  templateUrl: './my-templates.html'
})
export class MyTemplatesComponent implements OnInit {
  private templateService = inject(TemplateService);

  public searchTerm: string = '';
  public isNewDropdownOpen: boolean = false;
  
  // Estado reactivo para rastrear qué menú de opciones de plantilla está abierto
  public activeTemplateDropdownId = signal<string | null>(null);

  // Enlazamos directamente a los signals del servicio
  public folders = this.templateService.folders;
  public isLoading = this.templateService.isLoading;
  public backendStats = this.templateService.stats;

  ngOnInit(): void {
    this.loadScreenData();
  }

  private loadScreenData() {
    this.templateService.getFoldersAndTemplates().subscribe({
      error: (err) => console.error('Error cargando carpetas:', err)
    });

    this.templateService.getTemplateStats().subscribe({
      error: (err) => console.error('Error cargando métricas:', err)
    });
  }

  toggleNewDropdown() {
    this.isNewDropdownOpen = !this.isNewDropdownOpen;
  }

  toggleFolder(folder: Folder) {
    folder.open = !folder.open;
  }

  toggleTemplateOptions(event: Event, templateId: string | undefined) {
    event.stopPropagation(); // Evita clics no deseados en el contenedor
    if (!templateId) return;
    
    if (this.activeTemplateDropdownId() === templateId) {
      this.activeTemplateDropdownId.set(null);
    } else {
      this.activeTemplateDropdownId.set(templateId);
    }
  }

  deleteTemplate(event: Event, templateId: string | undefined) {
    event.stopPropagation();
    if (!templateId) return;

    if (confirm('¿Estás seguro de que deseas eliminar esta plantilla corporativa?')) {
      // Nota: Si no tienes el método deleteTemplate creado en tu servicio 'templateService', 
      // puedes crearlo rápido mapeando un http.delete(`${this.TEMPLATES_API_URL}/${id}`)
      this.templateService.deleteTemplate(templateId).subscribe({
        next: () => {
          this.activeTemplateDropdownId.set(null);
          this.loadScreenData(); // Recargamos para refrescar la vista y los KPIs en tiempo real
        },
        error: (err) => {
          console.error('Error al borrar el template:', err);
          alert('No se pudo eliminar la plantilla debido a las reglas de suscripción o red.');
        }
      });
    }
  }
}