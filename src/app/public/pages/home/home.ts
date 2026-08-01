import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './home.html'
})
export class Home implements OnInit {
  private translocoService = inject(TranslocoService);
  private title = inject(Title);
  private meta = inject(Meta);

  public demoName: string = 'Brayhan';
  public demoCompany: string = 'TempMail Pro';

  // Lo dejamos vacío inicialmente
  public faqs: any[] = [];

  ngOnInit(): void {
    // 1. SEO Dinámico: Se traduce cuando el idioma cambia
    this.translocoService.selectTranslateObject('home.seo').subscribe(seo => {
      this.title.setTitle(seo.title);
      this.meta.updateTag({ name: 'description', content: seo.description });
    });

    // 2. FAQs Dinámicas: Escuchamos el cambio de idioma para actualizar el array
    this.translocoService.selectTranslateObject('home.faqs').subscribe(translatedFaqs => {
      // Transloco nos devuelve el array del JSON convertido en objeto/array de TS
      this.faqs = Array.isArray(translatedFaqs) ? translatedFaqs : Object.values(translatedFaqs);
    });
  }
}