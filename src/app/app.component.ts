import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly authService = inject(AuthService);

  menuItems = [
      {
        label: 'NOVO GRUPO',
        routerLink: ['/create-group']
      },
      {
        label: 'GRUPOS',
        routerLink: ['/my-groups'] // TODO: Alterar para as rotas certas futuramente
      },
      {
        label: 'CONFIGURAÇÕES',
        routerLink: ['/group', '2']
      }
    ];

}