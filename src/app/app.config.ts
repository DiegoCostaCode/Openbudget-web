import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LucideAngularModule, ArrowDownLeft, ArrowUpRight, Plus, Eye, EyeOff, Check, X, ChevronDown, ChevronUp, LogOut, User, Calendar } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    importProvidersFrom(
      LucideAngularModule.pick({
        ArrowDownLeft,
        ArrowUpRight,
        Plus,
        Eye,
        EyeOff,
        Check,
        X,
        ChevronDown,
        ChevronUp,
        LogOut,
        User,
        Calendar,
      })
    ),
  ]
};
