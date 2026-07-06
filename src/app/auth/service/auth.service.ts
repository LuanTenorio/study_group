import { HttpClient } from "@angular/common/http";
import { environment } from "../../../config/environment.dev"
import { Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../interface/auth.interface";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { User } from "../../user/interface/user.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly path = "/auth"
    private readonly apiUrl = `${environment.apiUrl}${this.path}`;
    private readonly tokenKey = "acess_token";
    private readonly userKey = "user";
    private readonly _currentUser = signal<User | null>(null);

    readonly currentUser = this._currentUser.asReadonly();

    constructor(
        private readonly http: HttpClient,
        @Inject(PLATFORM_ID) private readonly platformId: object
    ) {}

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            credentials
        );
    }

    register(data: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(
            `${this.apiUrl}/register`,
            data
        );
    }

    getToken(): string | null {
        if(!isPlatformBrowser(this.platformId)) {
            return null;
        }

        return localStorage.getItem(this.tokenKey);
    }

    saveToken(token: string): void {
        if(isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    saveSession(user: User): void {
        if(isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.userKey, JSON.stringify(user));
        }

        this._currentUser.set(this.getStoredUser());

    }

    getStoredUser(): User | null {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    logout(): void {
        if(isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);

            this._currentUser.set(null);
        }
    }
}
