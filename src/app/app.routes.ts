import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: "login", component: Login},
    {path: "register", component: Register},
    {path: "", component: Home, canActivate: [authGuard]}
];
