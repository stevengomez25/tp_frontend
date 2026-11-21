import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    private billingService: BillingService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Intentamos leer la referencia de los params de Wompi, y si no viene, la buscamos en localStorage
      let reference = params['reference'];
      this.transactionIdWompi = params['id'] || null;
      if (!reference && isPlatformBrowser(this.platformId)) {
        reference = localStorage.getItem('wompi_last_reference');
      }

      this.transactionIdWompi = params['id'] || null;
      
      if (reference) {
        this.loadSummary(reference);
        // Opcional: limpiar el storage una vez leída
        // localStorage.removeItem('wompi_last_reference');
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
    this.cdr.detectChanges();
    this.billingService.getOrderSummary(reference).subscribe({
      next: (summary) => {
        this.orderSummary = summary;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error obteniendo el resumen de orden:', err);
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
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