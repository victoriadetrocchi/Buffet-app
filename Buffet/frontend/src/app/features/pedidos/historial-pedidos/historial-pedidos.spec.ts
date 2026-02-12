import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPedidosComponent } from './historial-pedidos.component';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';

describe('HistorialPedidosComponent', () => {
  let component: HistorialPedidosComponent;
  let fixture: ComponentFixture<HistorialPedidosComponent>;

  const apiServiceMock = {
    get: () => of([]), 
    put: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPedidosComponent], 
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});