import { Injectable, PLATFORM_ID, Inject, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface CheckoutRequest {
  targetPlan: string;
  amountInCents: number;
  billingCycle: 'MONTHLY' | 'YEARLY'; // <-- Vuelve a agregarlo
}

export interface OrderResponse {
  orderId: number;
  reference: string;
  amountInCents: number;
  currency: string;
  integritySignature: string;
}

export interface OrderSummary {
  reference: string;
  amountInCents: number;
  currency: string;
  status: string;
  targetPlan: string;
  organizationName: string;
}

// Declaramos la variable global de Wompi para que TypeScript no arroje error compilando
declare var WidgetCheckout: any;

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly API_URL = `${environment.apiUrl}/api/payments`;
  private router = inject(Router);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object ) {}

  // <-- Inyectamos el platformId para saber si estamos en el navegador
  /**
   * 1. Solicita la orden de pago y la firma de integridad al Backend
   */
  public initiateCheckout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.API_URL}/checkout`, request);
  }

  /**
   * 2. Consulta el resumen de la transacción para la vista de confirmación
   */
  public getOrderSummary(reference: String): Observable<OrderSummary> {
    return this.http.get<OrderSummary>(`${this.API_URL}/order-summary/${reference}`);
  }

  /**
   * 3. Abre el Widget Nativo de Wompi de cara al usuario usando la firma del Backend
   */
  public openWompiWidget(order: OrderResponse, userEmail: string, fullName: string): void {
    // Configuración oficial del objeto de Checkout de Wompi
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wompi_last_reference', order.reference);
    }
    
    const checkoutConfig = {
      currency: order.currency,
      amountInCents: Number(order.amountInCents),
      reference: order.reference,
      publicKey: environment.wompiPublicKey, // Tu llave pública de Wompi en el environment
      signature: {
        integrity: order.integritySignature, // <--- CORREGIDO: Wompi espera esto exactamente
      },
      redirectUrl: `${window.location.origin}/order-confirmed`, // Redirección al terminar
      customerData: {
        email: userEmail,
        fullName: fullName,
      },
    };

    console.log('Configuración enviada al widget de Wompi:', checkoutConfig);
    // Instanciamos y abrimos el checkout modular
    const checkout = new WidgetCheckout(checkoutConfig);

    checkout.open((result: any) => {
  const transaction = result?.transaction;
  const reference = transaction?.reference || order.reference;
  const status = transaction?.status;

  console.log('Transacción finalizada en interfaz con estado:', status);

  if (reference) {
    localStorage.setItem('wompi_last_reference', reference);
  }

  // Redirección garantizada desde Angular al cerrar/finalizar el widget
  this.router.navigate(['/order-confirmed'], {
    queryParams: reference ? { reference } : {}
  });
});
  }
}
