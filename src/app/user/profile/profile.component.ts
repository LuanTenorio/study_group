import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../auth/service/auth.service';
import { Institution } from '../../institution/interface/institution.interface';
import { InstitutionService } from '../../institution/service/institution.service';
import { UpdateUserRequest } from '../interface/user.interface';
import { UserService } from '../service/user.service';

@Component({
    selector: 'user-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule]
})
export class ProfileComponent implements OnInit {
    readonly profileForm: FormGroup;
    readonly institutions = signal<Institution[]>([]);
    readonly isLoadingInstitutions = signal(true);
    readonly isSaving = signal(false);
    readonly requestError = signal('');
    readonly successMessage = signal('');

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly institutionService: InstitutionService,
        private readonly router: Router
    ) {
        this.profileForm = this.formBuilder.nonNullable.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.email, Validators.required]],
            institution_id: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        const user = this.authService.currentUser();

        if (!user) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.profileForm.patchValue({
            name: user.name,
            email: user.email,
            institution_id: user.institution_id
        });

        this.loadInstitutions();
    }

    onSubmit(): void {
        this.requestError.set('');
        this.successMessage.set('');

        const user = this.authService.currentUser();

        if (!user) {
            this.router.navigate(['/auth/login']);
            return;
        }

        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        const formValue = this.profileForm.getRawValue();
        const payload: UpdateUserRequest = {
            name: formValue.name,
            email: formValue.email,
            institution_id: Number(formValue.institution_id)
        };

        this.isSaving.set(true);

        this.userService.update(user.id, payload).subscribe({
            next: (updatedUser) => {
                this.authService.saveSession(updatedUser);
                this.profileForm.patchValue({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    institution_id: updatedUser.institution_id
                });
                this.successMessage.set('Perfil atualizado com sucesso.');
                this.isSaving.set(false);
            },
            error: (err: HttpErrorResponse) => {
                this.isSaving.set(false);

                if (err.status === 409) {
                    this.requestError.set('Este e-mail ja esta em uso.');
                    return;
                }

                if (err.status === 404) {
                    this.requestError.set('Usuario ou instituicao nao encontrado.');
                    return;
                }

                this.requestError.set('Nao foi possivel atualizar o perfil. Tente novamente mais tarde.');
            }
        });
    }

    private loadInstitutions(): void {
        this.isLoadingInstitutions.set(true);

        this.institutionService.findAll().subscribe({
            next: (institutions) => {
                this.institutions.set(institutions);
                this.isLoadingInstitutions.set(false);
            },
            error: () => {
                this.isLoadingInstitutions.set(false);
                this.requestError.set('Nao foi possivel carregar as instituicoes.');
            }
        });
    }
}
