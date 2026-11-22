import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate';

export interface DocStep {
  label: string;
  detail: string;
  snippet?: string;
}

export interface DocSection {
  id: string;
  category: 'Primeros pasos' | 'Plantillas y Editor' | 'Extensión e IA' | 'Planes y Facturación';
  title: string;
  summary: string;
  tags: string[];
  steps: DocStep[];
  tip?: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScrollAnimateDirective],
  templateUrl: './support.html',
})
export class Support {
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('Todas');
  activeSectionId = signal<string>('inicio-rapido');

  categories: string[] = [
    'Todas',
    'Primeros pasos',
    'Plantillas y Editor',
    'Extensión e IA',
    'Planes y Facturación',
  ];

  sections: DocSection[] = [
    {
      id: 'inicio-rapido',
      category: 'Primeros pasos',
      title: 'Inicio rápido y organización en carpetas',
      summary:
        'Aprende a acceder al panel, crear carpetas para organizar tus plantillas y estructurar tu espacio de trabajo.',
      tags: ['dashboard', 'carpetas', 'folders', 'acceso', 'cuenta', 'organización'],
      steps: [
        {
          label: 'Inicia sesión en tu cuenta',
          detail:
            'Ingresa con tu correo y contraseña desde la pantalla de acceso para sincronizar tus carpetas, plantillas y plan activo.',
        },
        {
          label: 'Crea carpetas desde el Panel o Carpeta',
          detail:
            'Usa la acción de nueva carpeta para separar respuestas por área o flujo (por ejemplo: Ventas, Soporte, Seguimiento o Recursos Humanos).',
          snippet: 'Carpeta sugerida: "Ventas / Seguimiento inicial"',
        },
        {
          label: 'Revisa tus métricas en el Dashboard',
          detail:
            'Consulta plantillas creadas, carpetas activas, uso de cupos y estado de tu plan actual desde el panel principal.',
        },
      ],
      tip: 'Los planes superiores permiten carpetas compartidas y despliegue global de plantillas para equipos.',
    },
    {
      id: 'editor-variables',
      category: 'Plantillas y Editor',
      title: 'Crear plantillas personalizadas y variables dinámicas',
      summary:
        'Redacta plantillas reutilizables con nombre interno, asunto, cuerpo y campos dinámicos para agilizar cada envío.',
      tags: ['plantillas', 'templates', 'editor', 'variables', 'nombre', 'fecha', 'copiar'],
      steps: [
        {
          label: 'Define los metadatos de la plantilla',
          detail:
            'Asigna un nombre interno claro para localizarla rápido, selecciona la carpeta destino y escribe el asunto del correo.',
        },
        {
          label: 'Inserta variables dinámicas',
          detail:
            'Usa marcadores dinámicos dentro del cuerpo del correo para completar datos cambiantes de cada cliente o fecha sin reescribir.',
          snippet: 'Hola {{Nombre}}, te compartimos la propuesta actualizada al {{Fecha}}.',
        },
        {
          label: 'Procesa y copia el resultado',
          detail:
            'Completa los valores de los campos dinámicos en el editor y usa la opción de procesar y copiar para tener el texto listo.',
        },
      ],
    },
    {
      id: 'extension-dom',
      category: 'Extensión e IA',
      title: 'Extensión de Chrome, DOM y base de datos con IA',
      summary:
        'Utiliza la extensión en el navegador para detectar campos de redacción en correos mediante manipulación del DOM y analizar información con IA.',
      tags: ['chrome', 'extensión', 'gmail', 'outlook', 'dom', 'base de datos', 'ia', 'análisis'],
      steps: [
        {
          label: 'Abre tu cliente de correo en el navegador',
          detail:
            'Entra a tu correo web (como Gmail u Outlook) y abre un borrador o hilo de mensaje.',
        },
        {
          label: 'Inyecta plantillas mediante el DOM',
          detail:
            'La extensión detecta los campos del editor de correo mediante manipulación segura del DOM e inserta la plantilla conservando el formato.',
        },
        {
          label: 'Analiza correos con base de datos conectada a IA',
          detail:
            'Apóyate en el análisis asistido por IA conectado a tu base de datos para interpretar el contexto del correo y agilizar respuestas.',
        },
      ],
    },
    {
      id: 'ia-enhanced',
      category: 'Plantillas y Editor',
      title: 'IA Enhanced: tono, traducción y revisión',
      summary:
        'Mejora la redacción de tus plantillas y correos verificando coherencia, cohesión, profesionalismo, tono o traducción.',
      tags: ['ia enhanced', 'tono', 'traducir', 'coherencia', 'cohesión', 'profesionalismo', 'ia'],
      steps: [
        {
          label: 'Revisa coherencia y cohesión',
          detail:
            'Aplica sugerencias de mejora sobre tus borradores o plantillas para que el mensaje sea claro, natural y bien estructurado.',
        },
        {
          label: 'Ajusta el tono o traduce el mensaje',
          detail:
            'Adapta el nivel de formalidad o traduce el contenido según el destinatario antes de enviarlo.',
        },
      ],
      tip: 'Revisa siempre las variables dinámicas y datos específicos antes de enviar el correo final.',
    },
    {
      id: 'planes-automatizacion',
      category: 'Planes y Facturación',
      title: 'Planes, automatización de comunicaciones y prueba de 30 días',
      summary:
        'Conoce cómo elegir plan, acceder a la automatización de comunicaciones en planes superiores y gestionar tu prueba de 30 días.',
      tags: ['planes', 'billing', 'automatización', '30 días', 'prueba', 'wompi', 'confirmación'],
      steps: [
        {
          label: 'Selecciona el plan adecuado en Facturación',
          detail:
            'Compara opciones individuales y de equipo, elige ciclo mensual o anual y completa el pago en el widget seguro de Wompi.',
        },
        {
          label: 'Verifica la confirmación de tu orden',
          detail:
            'Al finalizar el pago, serás redirigido a la vista de confirmación donde podrás revisar el estado de la transacción y la referencia.',
        },
        {
          label: 'Automatización en planes superiores y prueba de 30 días',
          detail:
            'Los planes más costosos habilitan automatización de comunicaciones, y el periodo de prueba de 30 días aplica bajo términos y condiciones.',
        },
      ],
    },
    {
      id: 'soporte-tecnico',
      category: 'Primeros pasos',
      title: 'Acompañamiento técnico en las próximas 2 horas',
      summary:
        'Cómo aprovechar el acompañamiento técnico profesional para revisar detalles, detectar fallos o identificar mejoras.',
      tags: ['soporte', 'acompañamiento', '2 horas', 'fallos', 'mejoras', 'ayuda'],
      steps: [
        {
          label: 'Prepara el contexto de tu caso',
          detail:
            'Ten a la mano la vista o flujo donde ocurre el inconveniente, la referencia si aplica y el resultado esperado.',
        },
        {
          label: 'Coordina la revisión en las próximas 2 horas',
          detail:
            'Utiliza el acompañamiento técnico profesional en las próximas 2 horas para diagnosticar fallos, validar configuraciones y aplicar mejoras.',
        },
      ],
    },
  ];

  filteredSections = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();

    return this.sections.filter((sec) => {
      const matchesCategory = cat === 'Todas' || sec.category === cat;
      if (!matchesCategory) return false;
      if (!q) return true;

      const inTitle = sec.title.toLowerCase().includes(q);
      const inSummary = sec.summary.toLowerCase().includes(q);
      const inCategory = sec.category.toLowerCase().includes(q);
      const inTags = sec.tags.some((t) => t.toLowerCase().includes(q));
      const inSteps = sec.steps.some(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.detail.toLowerCase().includes(q) ||
          (s.snippet && s.snippet.toLowerCase().includes(q)),
      );

      return inTitle || inSummary || inCategory || inTags || inSteps;
    });
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('Todas');
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  scrollToSection(sectionId: string): void {
    this.activeSectionId.set(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}