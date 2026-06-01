import { Component } from '@angular/core';
import { TabelaRegistros } from '../../components/tabela-registros/tabela-registros';

@Component({
  selector: 'app-home',
  imports: [TabelaRegistros],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
