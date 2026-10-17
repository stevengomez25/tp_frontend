import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'use-template/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'folders',
    renderMode: RenderMode.Server
  },
  {
    path: 'signup',
    renderMode: RenderMode.Server
  },
  {
    path: 'getting-started',
    renderMode: RenderMode.Server
  },
  {
    path: 'my-templates',
    renderMode: RenderMode.Server
  },
  {
    path: 'billing',
    renderMode: RenderMode.Server
  },
  {
    path: 'order-confirmed',
    renderMode: RenderMode.Server
  },
  {
    path: 'new-template',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // Keep default static rendering for general public/home pages if desired
  }
];