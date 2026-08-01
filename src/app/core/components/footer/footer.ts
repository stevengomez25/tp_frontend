import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './footer.html'
})
export class FooterComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  
  public currentYear = new Date().getFullYear();
  public footerSections: any[] = [];

  ngOnInit(): void {
    // Escuchamos los cambios de idioma para actualizar las secciones
    this.translocoService.selectTranslateObject('footer.sections').subscribe(sections => {
      if (sections) {
        // Convertimos el objeto del JSON en un array para el @for
        this.footerSections = Array.isArray(sections) ? sections : Object.values(sections);
      }
    });
  }
}