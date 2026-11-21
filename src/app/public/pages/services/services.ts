import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

interface ServiceSlide {
  badge: string;
  title: string;
  description: string;
  footerNote: string;
  accentGradient: string;
}

@Component({
  selector: 'app-services-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss'],
})
export class Services implements AfterViewInit, OnDestroy {
  @ViewChild('hostContainer', { static: true }) hostContainer!: ElementRef<HTMLElement>;
  showAfterShowcase = false;
  services: ServiceSlide[] = [
    {
      badge: '01 · Plantillas',
      title: 'Plantillas personalizadas',
      description:
        'Diseña y organiza plantillas a medida para tus flujos recurrentes, manteniendo coherencia visual y agilizando cada envío.',
      footerNote: 'Listo para uso diario y equipos',
      accentGradient:
        'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(30, 27, 75, 0.88) 100%)',
    },
    {
      badge: '02 · IA + Extensión Chrome',
      title: 'Base de datos conectada con IA y extensión Chrome',
      description:
        'Administración de base de datos conectada con IA para analizar correos mediante manipulación del DOM directamente desde una extensión de Chrome.',
      footerNote: 'Análisis contextual en tiempo real',
      accentGradient:
        'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(12, 74, 110, 0.88) 100%)',
    },
    {
      badge: '03 · IA Enhanced',
      title: 'IA Enhanced',
      description:
        'Recibe sugerencias de mejora para tus plantillas con revisión de coherencia, cohesión y profesionalismo antes de enviar.',
      footerNote: 'Redacción clara y profesional',
      accentGradient:
        'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(49, 46, 129, 0.88) 100%)',
    },
    {
      badge: '04 · Soporte directo',
      title: 'Acompañamiento técnico en las próximas 2 horas',
      description:
        'Acompañamiento técnico profesional en las próximas 2 horas para revisar detalles, detectar fallos e identificar áreas de mejora.',
      footerNote: 'Revisión ágil y especializada',
      accentGradient:
        'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(19, 78, 74, 0.88) 100%)',
    },
    {
      badge: '05 · Prueba gratuita',
      title: 'Periodo de prueba de 30 días',
      description:
        'Evalúa la plataforma durante 30 días para validar su funcionamiento en tu operación, aplicando términos y condiciones.',
      footerNote: 'Aplica términos y condiciones',
      accentGradient:
        'linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(120, 53, 15, 0.88) 100%)',
    },
    {
      badge: '06 · Planes superiores',
      title: 'Automatización de comunicaciones',
      description:
        'Automatiza flujos y respuestas de comunicación para escalar tu operación en los planes más costosos.',
      footerNote: 'Exclusivo en planes de mayor nivel',
      accentGradient:
        'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(67, 56, 202, 0.9) 100%)',
    },
  ];

  private gsapCtx?: gsap.Context;
  private observer?: Observer;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    gsap.registerPlugin(Observer);

    this.gsapCtx = gsap.context(() => {
      const root = this.hostContainer.nativeElement;
      const sections = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll('section.slide-section'),
      );
      const images = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.bg'));
      const headings = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.section-heading'));
      const copies = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.service-copy'));
      const outerWrappers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.outer'));
      const innerWrappers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.inner'));

      const lastIndex = sections.length - 1;
      let currentIndex = -1;
      let animating = false;
      let releasedToNativeScroll = false;
      

      gsap.set(outerWrappers, { yPercent: 100 });
      gsap.set(innerWrappers, { yPercent: -100 });

      const releaseScrollToPage = () => {
        releasedToNativeScroll = true;
        this.showAfterShowcase = true;
        this.observer?.disable();
        // Si tienes un bloque debajo (como un footer o CTA en el flujo normal), desplázate hacia él
        const belowBlock = root.querySelector('.after-showcase') as HTMLElement | null;
        if (belowBlock) {
          belowBlock.scrollIntoView({ behavior: 'smooth' });
        }
      };

      const gotoSection = (index: number, direction: number) => {
        if (index < 0 && direction === -1) {
          return;
        }

        // Al pasar de la 6.ª sección (índice 5) hacia abajo, no cicla a la 1.ª: permite bajar
        if (index > lastIndex && direction === 1) {
          releaseScrollToPage();
          return;
        }

        const targetIndex = index;
        animating = true;

        const fromTop = direction === -1;
        const dFactor = fromTop ? -1 : 1;

        const tl = gsap.timeline({
          defaults: { duration: 0.55, ease: 'power2.out' },
          onComplete: () => {
            animating = false;
          },
        });

        if (currentIndex >= 0) {
          gsap.set(sections[currentIndex], { zIndex: 0 });
          tl.to(images[currentIndex], { yPercent: -15 * dFactor }, 0).set(sections[currentIndex], {
            autoAlpha: 0,
          });
        }

        gsap.set(sections[targetIndex], { autoAlpha: 1, zIndex: 1 });

        tl.fromTo(
          [outerWrappers[targetIndex], innerWrappers[targetIndex]],
          {
            yPercent: (i: number) => (i ? -100 * dFactor : 100 * dFactor),
          },
          {
            yPercent: 0,
          },
          0,
        )
          .fromTo(images[targetIndex], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
          .fromTo(
            headings[targetIndex],
            {
              autoAlpha: 0,
              yPercent: 35 * dFactor,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.45,
              ease: 'power2.out',
            },
            0.08,
          )
          .fromTo(
            copies[targetIndex],
            {
              autoAlpha: 0,
              y: 16 * dFactor,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out',
            },
            0.14,
          );

        currentIndex = targetIndex;
      };

      this.observer = Observer.create({
        target: root,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onDown: () => {
          if (releasedToNativeScroll && window.scrollY <= 10) {
            releasedToNativeScroll = false;
            this.showAfterShowcase = false;
            this.observer?.enable();
          }
          if (!animating && !releasedToNativeScroll) {
            gotoSection(currentIndex - 1, -1);
          }
        },
        onUp: () => {
          if (!animating && !releasedToNativeScroll) {
            gotoSection(currentIndex + 1, 1);
          }
        },
        tolerance: 10,
        preventDefault: true,
      });

      gotoSection(0, 1);
    }, this.hostContainer);
  }

  ngOnDestroy(): void {
    this.observer?.kill();
    this.gsapCtx?.revert();
  }
}
