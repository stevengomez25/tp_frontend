import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { TemplateService } from '../../../core/services/template-sync'; // Revisa tu ruta

@Component({
  selector: 'app-new-template',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslocoModule],
  templateUrl: './new-template.html',
})
export class NewTemplateComponent implements OnInit {
  private templateService = inject(TemplateService);
  private router = inject(Router);

  // Estructura limpia alineada con las necesidades de Spring Boot
  public templateData = {
    name: '',       // Será el 'title' en el DTO
    folderId: '',   // Almacenará el ID UUID/Long de la carpeta seleccionada
    subject: '',
    content: '',
    lang: 'ES'      // Idioma por defecto
  };

  public showVariableModal = false;
  public newVariable = {
    name: '',
    isBold: false,
    isItalic: false,
    color: '#1e40af',
  };

  public dynamicValues: { [key: string]: string } = {};
  public dynamicFields: string[] = [];
  private savedRange: Range | null = null;

  // Compartimos el Signal global de carpetas para que el select se llene con datos reales
  public folders = this.templateService.folders;
  public isSaving = false; // Estado visual de carga para deshabilitar el botón

  ngOnInit(): void {
    // Si el usuario entró directo a esta página y el state de carpetas está vacío, lo cargamos
    if (this.folders().length === 0) {
      this.templateService.getFoldersAndTemplates().subscribe();
    }
  }

  openVariableModal() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
    }
    this.newVariable = { name: '', isBold: false, isItalic: false, color: '#1e40af' };
    this.showVariableModal = true;
  }

  confirmInsertion() {
    if (!this.newVariable.name) return;

    const span = document.createElement('span');
    span.className = 'dynamic-chip';
    span.contentEditable = 'false';
    span.innerText = `{{${this.newVariable.name}}}`;

    span.style.fontWeight = this.newVariable.isBold ? '800' : '700';
    span.style.fontStyle = this.newVariable.isItalic ? 'italic' : 'normal';
    span.style.color = this.newVariable.color;
    span.style.backgroundColor = `${this.newVariable.color}15`;
    span.style.borderColor = `${this.newVariable.color}40`;

    if (this.savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(this.savedRange);

        this.savedRange.deleteContents();
        this.savedRange.insertNode(span);

        this.savedRange.setStartAfter(span);
        this.savedRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(this.savedRange);
      }
    } else {
      const editor = document.getElementById('editor');
      if (editor) editor.appendChild(span);
    }

    this.showVariableModal = false;
    this.updateDynamicFields();
    this.savedRange = null;
  }

  execCommand(command: string, value: string = '') {
    document.execCommand(command, false, value);
  }

  updateDynamicFields() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    const content = editor.innerHTML;
    const matches = content.match(/{{(.*?)}}/g);

    if (matches) {
      const fields = matches.map((m) => m.replace(/{{|}}/g, '').trim());
      this.dynamicFields = [...new Set(fields)];

      this.dynamicFields.forEach((field) => {
        if (!(field in this.dynamicValues)) {
          this.dynamicValues[field] = '';
        }
      });
    } else {
      this.dynamicFields = [];
    }
  }

  insertChip(defaultValue: string) {
    const fieldName = prompt('Nombre del campo (ej: cliente, fecha):', defaultValue);
    if (!fieldName) return;

    const span = document.createElement('span');
    span.className = 'dynamic-chip';
    span.contentEditable = 'false';
    span.innerText = `{{${fieldName}}}`;

    span.style.backgroundColor = '#dbeafe';
    span.style.color = '#1e40af';
    span.style.padding = '2px 8px';
    span.style.borderRadius = '6px';
    span.style.border = '1px solid #bfdbfe';
    span.style.fontWeight = '700';
    span.style.margin = '0 4px';
    span.style.display = 'inline-flex';

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.updateDynamicFields();
  }

  // --- BOTÓN DE GUARDAR EN BACKEND ---
  saveTemplate() {
    const editableDiv = document.getElementById('editor');
    const htmlContent = editableDiv?.innerHTML || '';

    // Validaciones básicas de negocio antes de disparar HTTP
    if (!this.templateData.name.trim() || !this.templateData.folderId || !htmlContent.trim()) {
      alert('Por favor completa el nombre, selecciona una carpeta y escribe un contenido.');
      return;
    }

    this.isSaving = true;

    // Estructuramos el DTO exactamente como lo espera tu controlador de Java
    const newTemplateDto = {
      title: this.templateData.name,
      folderId: this.templateData.folderId,
      subject: this.templateData.subject,
      content: htmlContent,
      lang: this.templateData.lang
    };

    this.templateService.createTemplate(newTemplateDto).subscribe({
      next: (response) => {
        this.isSaving = false;
        // Redirigimos de vuelta a la lista de plantillas corporativas con los datos frescos
        this.router.navigate(['/my-templates']);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error guardando la plantilla en Spring Boot:', err);
        alert('Hubo un error al intentar guardar la plantilla. Verifica la consola.');
      }
    });
  }

  copyProcessedTemplate() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    let htmlContent = editor.innerHTML;

    Object.keys(this.dynamicValues).forEach((key) => {
      const value = this.dynamicValues[key] || `{{${key}}}`;
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, value);
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const chips = tempDiv.querySelectorAll('.dynamic-chip');
    chips.forEach((chip) => {
      const textNode = document.createTextNode((chip as HTMLElement).innerText);
      chip.parentNode?.replaceChild(textNode, chip);
    });

    navigator.clipboard.writeText(tempDiv.innerHTML).then(() => {
      alert('¡Plantilla procesada copiada al portapapeles!');
    });
  }
}