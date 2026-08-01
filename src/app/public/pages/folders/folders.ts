import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { TemplateService } from '../../../core/services/template-sync'; // Ajusta la ruta a tu estructura

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslocoModule],
  templateUrl: './folders.html'
})
export class FoldersComponent implements OnInit {
  private templateService = inject(TemplateService);

  // Enlazamos directamente a los estados reactivos del servicio corporativo
  public folders = this.templateService.folders;
  public isLoading = this.templateService.isLoading;

  // Estados locales de la vista
  public searchTerm: string = '';
  public isModalOpen = signal<boolean>(false);
  public newFolderName = signal<string>('');
  public isSaving = signal<boolean>(false);

  ngOnInit(): void {
    // Si no se han cargado datos previamente en la sesión, los forzamos desde el backend
    // Usamos navegación segura en caso de que folders() sea inicialmente nulo
    if (!this.folders() || this.folders().length === 0) {
      this.templateService.getFoldersAndTemplates().subscribe();
    }
  }

  openCreateModal() {
    this.newFolderName.set('');
    this.isModalOpen.set(true);
  }

  closeCreateModal() {
    this.isModalOpen.set(false);
  }

  submitCreateFolder() {
    const name = this.newFolderName().trim();
    if (!name) {
      alert('El nombre de la carpeta no puede estar vacío.');
      return;
    }

    this.isSaving.set(true);

    this.templateService.createFolder(name).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeCreateModal();
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Error al crear la carpeta en Spring Boot:', err);
        alert('No se pudo crear la carpeta corporativa. Revisa la consola.');
      }
    });
  }
}