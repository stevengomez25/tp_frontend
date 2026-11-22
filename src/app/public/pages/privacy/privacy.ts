import { Component } from '@angular/core';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate';

@Component({
  selector: 'app-privacy',
  imports: [ScrollAnimateDirective],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy {}
