import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: "login", component: Login},
    {path: "", component: Home, canActivate: [authGuard]}
];
