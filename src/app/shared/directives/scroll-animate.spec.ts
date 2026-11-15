import { ScrollAnimateDirective } from './scroll-animate';

describe('ScrollAnimateDirective', () => {
  it('should create an instance', () => {
    const element = { nativeElement: document.createElement('div') } as any;
    const renderer = {} as any;
    const directive = new ScrollAnimateDirective(element, renderer);
    expect(directive).toBeTruthy();
  });
});
