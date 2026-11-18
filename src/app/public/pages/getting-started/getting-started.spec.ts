import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStartedComponent } from './getting-started';

describe('GettingStartedComponent', () => {
  let component: GettingStartedComponent;
  let fixture: ComponentFixture<GettingStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GettingStartedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
