import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillingService, OrderSummary } from '../../services/billing';

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmed.html',
  styleUrls: ['./order-confirmed.scss']
})
export class OrderConfirmedComponent implements OnInit {
  
  loading: boolean = true;
  error: boolean = false;
  orderSummary?: OrderSummary;
  transactionIdWompi: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    // 1. Capturamos los parámetros que Wompi inyecta en la URL de retorno
    this.route.queryParams.subscribe(params => {
      const reference = params['reference'];
      this.transactionIdWompi = params['id'] || null;

      if (reference) {
        this.loadSummary(reference);
      } else {
        this.loading = false;
        this.error = true;
      }
    });
  }

  /**
   * Consulta al Backend el estado real de la transacción usando la referencia única
   */
  private loadSummary(reference: string): void {
    this.billingService.getOrderSummary(reference).subscribe({
      next: (summary) => {
        this.orderSummary = summary;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error obteniendo el resumen de orden:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  /**
   * Helper para formatear el dinero en centavos a pesos colombianos legibles
   */
  formatCurrency(amountInCents?: number): string {
    if (!amountInCents) return '$0';
    return '$' + Math.round(amountInCents / 100).toLocaleString('es-CO');
  }
}