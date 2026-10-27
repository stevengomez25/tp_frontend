import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'signup', renderMode: RenderMode.Prerender },
  { path: 'order-confirmed', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server }
];