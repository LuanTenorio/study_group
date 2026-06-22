import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  menuItems = [
      {
        label: 'GRUPOS',
        routerLink: ['/group', '1'] // TODO: Alterar para as rotas certas futuramente
      },
      {
        label: 'CONFIGURAÇÕES',
        routerLink: ['/group', '2']
      }
    ];

}