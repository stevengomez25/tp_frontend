import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BillingService, CheckoutRequest } from '../../services/billing';
import { AuthService } from '../../services/auth';

interface PlanInterface {
  id: string;
  name: string;
  type: 'B2C' | 'B2B';
  monthlyPrice: number;
  description: string;
  features: string[];
  badge?: string;
}

@Component({
  selector: 'app-billing',
  imports: [CommonModule],
  templateUrl: './billing.html',
  styleUrls: ['./billing.scss'],
})
export class BillingComponent implements OnInit {
  // false = Mensual, true = Anual
  isYearly: boolean = false;

  planes: PlanInterface[] = [
    // --- INDEPENDIENTES (B2C) ---
    {
      id: 'FREE',
      name: 'Plan Free',
      type: 'B2C',
      monthlyPrice: 0,
      description: 'El gancho ideal para iniciar a automatizar.',
      features: [
        'Hasta 15 templates en total',
        '1 sola carpeta de organización',
        'Variables dinámicas básicas ({{Nombre}}, {{Fecha}})',
        'Adaptación básica para Gmail/Outlook',
        'Firma obligatoria al final de los correos',
      ],
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      type: 'B2C',
      monthlyPrice: 19000, // $19.000 COP
      description: 'Ideal para Freelancers y Ventas independientes.',
      features: [
        'Templates y carpetas ilimitadas',
        'Variables personalizadas ilimitadas',
        'Condicionales lógicos ("Si X entonces Y")',
        'Eliminación de marca de agua / firma',
        'Uso simultáneo en múltiples dispositivos',
      ],
      badge: 'Más Popular',
    },
    {
      id: 'PREMIUM_PLUS',
      name: 'Premium+ (Con IA)',
      type: 'B2C',
      monthlyPrice: 39000, // $39.000 COP
      description: 'Potencia tus correos con Inteligencia Artificial.',
      features: [
        'Todo lo del plan Premium',
        'Asistencia de IA integrada',
        'Funciones "Mejora mi tono" y "Traduce correo"',
        'Límite de 100 peticiones de IA al mes',
      ],
    },
    // --- CORPORATIVOS (B2B) ---
    {
      id: 'STARTER_TEAM',
      name: 'Starter Team',
      type: 'B2B',
      monthlyPrice: 99000, // $99.000 COP
      description: 'Pequeños equipos buscando consistencia.',
      features: [
        '1 Manager/Admin + hasta 9 usuarios (Asientos)',
        'Todo lo del plan Premium+ (IA compartida)',
        'Creación de Carpetas Compartidas',
        'El Manager despliega plantillas globales',
      ],
    },
    {
      id: 'GROWTH_TEAM',
      name: 'Growth Team',
      type: 'B2B',
      monthlyPrice: 249000, // $249.000 COP
      description: 'Control avanzado de marca y analíticas básicas.',
      features: [
        'Multi-Admins + Creadores + Lectura (Hasta 25 usuarios)',
        'Control de Marca (Bloqueo estructural de templates)',
        'Vendedores solo editan variables, no el cuerpo',
        'Dashboard de analíticas de uso global',
      ],
      badge: 'Mejor Valor B2B',
    },
    {
      id: 'SCALE_UP',
      name: 'Scale-up',
      type: 'B2B',
      monthlyPrice: 599000, // $599.000 COP
      description: 'Para operaciones comerciales en crecimiento.',
      features: [
        'Soporte desde 26 hasta 100 miembros',
        'Analíticas avanzadas (Tracking por vendedor)',
        'Flujo de trabajo: Aprobación previa de templates',
      ],
    },
    {
      id: 'ENTERPRISE',
      name: 'Corporativo',
      type: 'B2B',
      monthlyPrice: 999000, // $999.000 COP (Ajusta el precio si lo requieres)
      description: 'Para organizaciones que requieren control total y cumplimiento.',
      features: [
        'Miembros ilimitados',
        'Integración SSO',
        'Soporte 24/7',
        'Auditoría avanzada',
      ],
      badge: 'Recomendado',
    },
  ];

  constructor(
    private billingService: BillingService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  getPlanPrice(basePrice: number): number {
    if (basePrice === 0) return 0;
    if (this.isYearly) {
      return Math.round(basePrice * 0.8);
    }
    return basePrice;
  }

  selectPlan(planId: string) {
    if (planId === 'FREE') return;

    const planSelected = this.planes.find((p) => p.id === planId);
    if (!planSelected) return;

    // 1. Calculamos el monto final en centavos
    const finalMonthlyPrice = this.getPlanPrice(planSelected.monthlyPrice);
    const totalAmountInCents = this.isYearly
      ? finalMonthlyPrice * 12 * 100
      : finalMonthlyPrice * 100;

    // 2. Payload limpio que coincide 100% con el DTO de Java
    const checkoutData: CheckoutRequest = {
      targetPlan: planId,
      amountInCents: totalAmountInCents,
      // Se elimina 'billingCycle' porque el backend no lo tiene en su CheckoutRequest
    };

    // 3. Consumimos el backend y abrimos Wompi
    this.billingService.initiateCheckout(checkoutData).subscribe({
      next: (orderResponse) => {
        const currentUser = this.authService.currentUser();
        const email = currentUser?.email || 'cliente@empresa.com';
        const name = currentUser?.name || 'Usuario TempMailPro';

        this.billingService.openWompiWidget(orderResponse, email, name);
      },
      error: (err) => {
        console.error('Error al generar el checkout seguro:', err);
        alert('No se pudo procesar la solicitud de pago. Inténtalo de nuevo.');
      },
    });
  }
}