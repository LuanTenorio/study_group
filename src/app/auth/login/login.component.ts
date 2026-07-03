import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModule } from 'primeng/message'

@Component({
    selector: 'auth/login',
    templateUrl: './login.component.html',
    imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule]
})
export class LoginComponent {
    readonly loginForm: FormGroup;
    readonly requestError = signal('');

    constructor(private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router) {
        this.loginForm = this.formBuilder.nonNullable.group({email: ['', [Validators.email, Validators.required]], password: ['', [Validators.required]]});
    }

    onSubmit(): void {
        if(this.loginForm.invalid) {
            return;
        }

        const credentials = this.loginForm.getRawValue();

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.router.navigate(['/group', 1])
            },
            error: (err: HttpErrorResponse) => {
                if(err.status == 401) {
                    this.requestError.set('E-mail ou senha inválidos!');
                    return;
                }

                this.requestError.set('Não foi possível realizar login. Tente novamente, mais tarde');
            }
        });
    }
    
}
