import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'use-template/:id',
    renderMode: RenderMode.Server // Change render mode to Server for dynamic ID routes
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];