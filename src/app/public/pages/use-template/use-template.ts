import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TemplateService } from '../../../core/services/template-sync'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-use-template',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslocoModule],
  templateUrl: './use-template.html',
})
export class UseTemplateComponent implements OnInit {
  private templateService = inject(TemplateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer); // <-- Protege los estilos inyectados

  // Convertimos los estados a Signals para garantizar que la pantalla se actualice
  public isLoading = signal<boolean>(true);
  public templateData = signal({ title: '', subject: '', content: '' });
  public dynamicFields = signal<string[]>([]);
  
  // Objeto tradicional para que el ngModel del HTML funcione sin trabas
  public dynamicValues: { [key: string]: string } = {};

  ngOnInit(): void {
    const templateId = this.route.snapshot.paramMap.get('id');
    if (templateId) {
      this.loadTemplate(templateId);
    } else {
      this.router.navigate(['/my-templates']);
    }
  }

  private loadTemplate(id: string) {
    this.isLoading.set(true);
    
    this.templateService.getTemplateById(id).subscribe({
      next: (data: any) => {
        console.log('✅ Plantilla cargada en Angular:', data);

        // Mapeamos lo que viene de Java a nuestros Signals
        this.templateData.set({
          title: data.name || 'Plantilla sin nombre',
          subject: data.subject || '',
          content: data.body || ''
        });

        this.extractDynamicFields(data.body || '');
        
        // ¡Apagamos el loader! Angular detectará este Signal y quitará el spinner
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando la plantilla', err);
        alert('No se pudo cargar la plantilla.');
        this.isLoading.set(false);
        this.router.navigate(['/my-templates']);
      }
    });
  }

  private extractDynamicFields(content: string) {
    const matches = content.match(/{{(.*?)}}/g);
    if (matches) {
      const fields = matches.map((m) => m.replace(/{{|}}/g, '').trim());
      const uniqueFields = [...new Set(fields)];
      
      this.dynamicFields.set(uniqueFields);
      
      uniqueFields.forEach((field) => {
        this.dynamicValues[field] = '';
      });
    } else {
      this.dynamicFields.set([]);
    }
  }

  getProcessedContent(): SafeHtml {
    let html = this.templateData().content; // Extraemos el valor del signal
    
    this.dynamicFields().forEach(field => {
      // Si el input está vacío, mostramos un badge amarillo, si no, el valor digitado
      const value = this.dynamicValues[field] ? this.dynamicValues[field] : `<span style="background-color: #fef08a; padding: 2px 4px; border-radius: 4px; font-weight: bold; color: #854d0e;">[${field}]</span>`;
      
      // Escapamos la variable por si el nombre tiene caracteres especiales
      const safeField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`{{${safeField}}}`, 'g');
      
      html = html.replace(regex, value);
    });

    // Le decimos a Angular que confíe en este HTML para que no borre los estilos
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getProcessedSubject(): string {
    let subject = this.templateData().subject;
    if (!subject) return 'Sin Asunto';
    
    this.dynamicFields().forEach(field => {
      const value = this.dynamicValues[field] ? this.dynamicValues[field] : `[${field}]`;
      const safeField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`{{${safeField}}}`, 'g');
      subject = subject.replace(regex, value);
    });
    return subject;
  }

  async copyToClipboard() {
    // Obtenemos el HTML procesado
    const htmlContent = this.templateData().content; 
    let htmlFinal = htmlContent;

    // Reprocesamos el HTML limpio para el portapapeles sin el Sanitizer
    this.dynamicFields().forEach(field => {
      const value = this.dynamicValues[field] ? this.dynamicValues[field] : `[${field}]`;
      const safeField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`{{${safeField}}}`, 'g');
      htmlFinal = htmlFinal.replace(regex, value);
    });

    // Fallback de texto plano
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlFinal;
    const plainText = tempDiv.innerText;

    try {
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
        'text/html': new Blob([htmlFinal], { type: 'text/html' })
      });

      await navigator.clipboard.write([clipboardItem]);
      alert('¡Plantilla copiada con formato! Pégala en Outlook o Gmail.');
    } catch (err) {
      console.error('Error usando ClipboardItem API, usando fallback: ', err);
      this.fallbackCopy(htmlFinal);
    }
  }

  private fallbackCopy(html: string) {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.opacity = '0';
    document.body.appendChild(container);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);
    document.execCommand('copy');
    selection?.removeAllRanges();
    document.body.removeChild(container);
    alert('¡Plantilla copiada con formato! (Modo compatibilidad)');
  }
}