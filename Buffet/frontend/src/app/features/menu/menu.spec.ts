import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const apiServiceMock = {
    get: () => of([]),
    post: () => of({})
  };

  const routerMock = {
    navigate: () => {} 
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});