import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorMenu } from './planificador-menu';

describe('PlanificadorMenu', () => {
  let component: PlanificadorMenu;
  let fixture: ComponentFixture<PlanificadorMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificadorMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificadorMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
