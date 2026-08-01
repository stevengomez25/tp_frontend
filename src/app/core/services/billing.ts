import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckoutRequest {
  targetPlan: string;
  amountInCents: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
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
  providedIn: 'root'
})
export class BillingService {
  
  private readonly API_URL = `${environment.baseUrl}/api/payments`;

  constructor(private http: HttpClient) { }

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
    const checkoutConfig = {
      currency: order.currency,
      amountInCents: order.amountInCents,
      reference: order.reference,
      publicKey: environment.wompiPublicKey, // Tu llave pública de Wompi en el environment
      signatureIntegrity: order.integritySignature,
      redirectUrl: `${window.location.origin}/dashboard/order-confirmed`, // Redirección al terminar
      customerData: {
        email: userEmail,
        fullName: fullName
      }
    };

    // Instanciamos y abrimos el checkout modular
    const checkout = new WidgetCheckout(checkoutConfig);
    checkout.open((result: any) => {
      const transaction = result.transaction;
      console.log(`Transacción finalizada en interfaz con estado: ${transaction.status}`);
    });
  }
}