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
  bossInput: string = ''; 

  // 🔄 IDs sincronizados exactamente con el Enum PlanType de Java
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
      id: 'PREMIUM', // Coincide con PlanType.PREMIUM
      name: 'Profesional',
      description: 'Para freelancers y solopreneurs que necesitan marca personal.',
      monthlyPrice: 19000,
      type: 'B2C',
      badge: 'Más Popular',
      features: ['Plantillas ilimitadas', 'Firmas personalizadas', 'Soporte prioritario']
    },
    {
      id: 'PREMIUM_PLUS', // Coincide con PlanType.PREMIUM_PLUS
      name: 'Premium+ (Con IA)',
      description: 'Potencia tus correos con Inteligencia Artificial.',
      monthlyPrice: 39000,
      type: 'B2C',
      features: ['Todo lo del plan Premium', 'Asistencia de IA integrada', 'Límite de peticiones de IA']
    },
    {
      id: 'STARTER_TEAM', // Coincide con PlanType.STARTER_TEAM
      name: 'Starter Team',
      description: 'Perfecto para agencias pequeñas y equipos en crecimiento.',
      monthlyPrice: 99000,
      type: 'B2B',
      features: ['Hasta 5 miembros', 'Control de marca centralizado', 'Estadísticas de uso']
    },
    {
      id: 'GROWTH_TEAM', // Coincide con PlanType.GROWTH_TEAM
      name: 'Growth Team',
      description: 'Control avanzado de marca y analíticas básicas.',
      monthlyPrice: 249000,
      type: 'B2B',
      badge: 'Mejor Valor B2B',
      features: ['Hasta 25 usuarios', 'Control de Marca', 'Dashboard de analíticas']
    },
    {
      id: 'SCALE_UP', // Coincide con PlanType.SCALE_UP
      name: 'Scale-up',
      description: 'Para operaciones comerciales en crecimiento.',
      monthlyPrice: 599000,
      type: 'B2B',
      features: ['De 26 a 100 miembros', 'Analíticas avanzadas', 'Flujo de aprobación previa']
    },
    {
      id: 'ENTERPRISE', // Coincide con PlanType.ENTERPRISE
      name: 'Corporativo',
      description: 'Para organizaciones que requieren control total y cumplimiento.',
      monthlyPrice: 999000, // Ajusta si es necesario
      type: 'B2B',
      badge: 'Recomendado',
      features: ['Miembros ilimitados', 'Integración SSO', 'Soporte 24/7', 'Auditoría avanzada']
    }
  ];

  // Métodos de navegación
  setView(view: 'selection' | 'b2c' | 'b2b' | 'member') {
    this.currentView = view;
    if (view === 'selection') {
      this.bossInput = '';
      this.bossNoDomain = false;
    }
  }

  getPlanPrice(price: number): number {
    return this.isYearly ? price * 0.8 : price; 
  }

  selectPlan(id: string) {
    console.log('Iniciando checkout para el plan:', id);
    // Aquí conectas con tu servicio de pago o backend enviando este id exacto.
  }

  submitMemberForm() {
    if (this.bossNoDomain) {
      console.log('Buscando equipo por correo del jefe:', this.bossInput);
    } else {
      console.log('Buscando equipo por dominio:', this.bossInput);
    }
  }

  continueWithFreePlan() {
    console.log('Omitiendo vinculación, continuando con plan gratuito');
  }
}