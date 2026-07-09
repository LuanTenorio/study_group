import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/service/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ToastModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly authService = inject(AuthService);

  menuItems = [
    {
      label: 'Novo Grupo',
      icon: 'pi pi-plus-circle',
      routerLink: ['/create-group']
    },
    {
      label: 'Meus Grupos',
      icon: 'pi pi-users',
      routerLink: ['/my-groups']
    },
  ];

}