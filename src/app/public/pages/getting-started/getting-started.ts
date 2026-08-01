import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  type: 'B2C' | 'B2B';
  badge?: string;
  features: string[];
}

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './getting-started.html'
})
export class GettingStartedComponent {
  // Estado actual de la vista
  currentView: 'selection' | 'b2c' | 'b2b' | 'member' = 'selection';
  
  // Variables para los planes
  isYearly: boolean = false;

  // Variables para la vista de "Miembro de equipo"
  bossNoDomain: boolean = false;
  bossInput: string = ''; // Guardará el dominio o el correo dependiendo del toggle

  // Datos de ejemplo basados en tu estructura HTML
  planes: Plan[] = [
    {
      id: 'FREE',
      name: 'Plan Base',
      description: 'Ideal para probar la plataforma y estandarizar tus primeros correos.',
      monthlyPrice: 0,
      type: 'B2C',
      features: ['5 plantillas básicas', 'Soporte comunitario']
    },
    {
      id: 'PRO',
      name: 'Profesional',
      description: 'Para freelancers y solopreneurs que necesitan marca personal.',
      monthlyPrice: 15,
      type: 'B2C',
      badge: 'Más Popular',
      features: ['Plantillas ilimitadas', 'Firmas personalizadas', 'Soporte prioritario']
    },
    {
      id: 'TEAM_START',
      name: 'Equipos Start',
      description: 'Perfecto para agencias pequeñas y equipos en crecimiento.',
      monthlyPrice: 49,
      type: 'B2B',
      features: ['Hasta 5 miembros', 'Control de marca centralizado', 'Estadísticas de uso']
    },
    {
      id: 'ENTERPRISE',
      name: 'Corporativo',
      description: 'Para organizaciones que requieren control total y cumplimiento.',
      monthlyPrice: 99,
      type: 'B2B',
      badge: 'Recomendado',
      features: ['Miembros ilimitados', 'Integración SSO', 'Soporte 24/7', 'Auditoría avanzada']
    }
  ];

  // Métodos de navegación
  setView(view: 'selection' | 'b2c' | 'b2b' | 'member') {
    this.currentView = view;
    // Reseteamos el formulario si volvemos a la selección
    if (view === 'selection') {
      this.bossInput = '';
      this.bossNoDomain = false;
    }
  }

  // Métodos de los planes
  getPlanPrice(price: number): number {
    return this.isYearly ? price * 0.8 : price; // 20% de descuento anual
  }

  selectPlan(id: string) {
    console.log('Iniciando checkout para el plan:', id);
    // Aquí va tu lógica para redirigir a Stripe, LemonSqueezy, etc.
  }

  // Métodos de la vista de miembro
  submitMemberForm() {
    if (this.bossNoDomain) {
      console.log('Buscando equipo por correo del jefe:', this.bossInput);
    } else {
      console.log('Buscando equipo por dominio:', this.bossInput);
    }
    // Lógica para asociar al usuario al workspace del jefe
  }

  continueWithFreePlan() {
    console.log('Omitiendo vinculación, continuando con plan gratuito');
    // Lógica para finalizar el registro en el tier gratuito
  }
}