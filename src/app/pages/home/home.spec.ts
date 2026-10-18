import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-angular';
import { of } from 'rxjs';
import { Home } from './home';
import { Transactions } from '../../services/transactions';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const transactionsMock = {
    generateView: () =>
      of({
        days: [
          {
            date: '2026-10-18',
            balance: 15630.71,
            transactions: [],
          },
        ],
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: Transactions, useValue: transactionsMock },
        importProvidersFrom(
          LucideAngularModule.pick({
            Plus,
            ArrowDownLeft,
            ArrowUpRight,
          })
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
