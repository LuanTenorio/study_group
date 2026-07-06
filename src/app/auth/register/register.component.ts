import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../service/auth.service';
import { RegisterRequest } from '../interface/auth.interface';
import { Institution } from '../../institution/interface/institution.interface';
import { InstitutionService } from '../../institution/service/institution.service';

@Component({
    selector: 'auth/register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [ReactiveFormsModule, RouterLink, InputTextModule, PasswordModule, ButtonModule, MessageModule]
})
export class RegisterComponent implements OnInit {
    readonly registerForm: FormGroup;
    readonly requestError = signal('');
    readonly institutions = signal<Institution[]>([]);
    readonly isLoadingInstitutions = signal(true);

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly institutionService: InstitutionService,
        private readonly router: Router
    ) {
        this.registerForm = this.formBuilder.nonNullable.group(
            {
                name: ['', [Validators.required, Validators.minLength(3)]],
                email: ['', [Validators.email, Validators.required]],
                institution_id: ['', [Validators.required]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', [Validators.required]]
            },
            { validators: RegisterComponent.passwordsMatch }
        );
    }

    ngOnInit(): void {
        this.loadInstitutions();
    }

    onSubmit(): void {
        this.requestError.set('');

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const formValue = this.registerForm.getRawValue();
        const payload: RegisterRequest = {
            name: formValue.name,
            email: formValue.email,
            institution_id: Number(formValue.institution_id),
            password: formValue.password
        };

        this.authService.register(payload).subscribe({
            next: (response) => {
                this.authService.saveToken(response.accessToken);
                this.authService.saveSession(response.user);
                this.router.navigate(['/group', 1]);
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === 409) {
                    this.requestError.set('Este e-mail já está cadastrado.');
                    return;
                }

                this.requestError.set('Não foi possível criar sua conta. Tente novamente mais tarde.');
            }
        });
    }

    private loadInstitutions(): void {
        this.isLoadingInstitutions.set(true);

        this.institutionService.findAll().subscribe({
            next: (institutions) => {
                this.institutions.set(institutions);

                if (institutions.length > 0) {
                    this.registerForm.patchValue({ institution_id: institutions[0].id });
                }

                this.isLoadingInstitutions.set(false);
            },
            error: () => {
                this.isLoadingInstitutions.set(false);
                this.requestError.set('Não foi possível carregar as instituições.');
            }
        });
    }

    private static passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (!password || !confirmPassword || password === confirmPassword) {
            return null;
        }

        return { passwordsMismatch: true };
    }
}
