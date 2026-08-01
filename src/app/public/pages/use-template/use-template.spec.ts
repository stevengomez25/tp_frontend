import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseTemplateComponent } from './use-template';

describe('UseTemplateComponent', () => {
  let component: UseTemplateComponent;
  let fixture: ComponentFixture<UseTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UseTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UseTemplateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
