import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaRegistros } from './tabela-registros';

describe('TabelaRegistros', () => {
  let component: TabelaRegistros;
  let fixture: ComponentFixture<TabelaRegistros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaRegistros],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaRegistros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
