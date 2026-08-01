import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTemplateComponent } from './new-template';

describe('NewTemplate', () => {
  let component: NewTemplateComponent;
  let fixture: ComponentFixture<NewTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTemplateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
