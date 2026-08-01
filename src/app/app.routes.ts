import { Routes } from '@angular/router';

import { Home } from './public/pages/home/home';
import { LoginComponent } from './core/components/login/login';
import { SignupComponent } from './core/components/signup/signup';
import { DashboardComponent } from './public/pages/dashboard/dashboard';
import { MyTemplatesComponent } from './public/pages/my-templates/my-templates';
import { NewTemplateComponent } from './public/pages/new-template/new-template';
import { authGuard } from './core/guards/auth-guard';
import { BillingComponent } from './core/components/billing/billing';
import { OrderConfirmedComponent } from './core/components/order-confirmed/order-confirmed';
import { FoldersComponent } from './public/pages/folders/folders';
import { UseTemplateComponent } from './public/pages/use-template/use-template';
import { GettingStartedComponent } from './public/pages/getting-started/getting-started';

export const routes: Routes = [
  { path: '', component: Home },
  {path:'login',component: LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'getting-started', component:GettingStartedComponent, canActivate:[authGuard]},
  {path:'dashboard', component:DashboardComponent, canActivate: [authGuard]},
  {path:'my-templates', component:MyTemplatesComponent, canActivate: [authGuard]},
  {path:'new-template', component: NewTemplateComponent, canActivate: [authGuard]},
  {path:'billing', component:BillingComponent,canActivate:[authGuard]},
  {path:'folders', component:FoldersComponent, canActivate:[authGuard]},
  {path:'order-confirmed', component:OrderConfirmedComponent},
  { path: 'use-template/:id', component: UseTemplateComponent },

  { path: '**', redirectTo: 'home', pathMatch: 'full' }
  // ... otras rutas
];
