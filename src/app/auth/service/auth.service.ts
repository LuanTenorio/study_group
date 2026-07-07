import { HttpClient } from "@angular/common/http";
import { environment } from "../../../config/environment.dev"
import { Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../interface/auth.interface";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { User } from "../../user/interface/user.interface";
import { Route, Router } from "@angular/router";

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
        private readonly router: Router,
        @Inject(PLATFORM_ID) private readonly platformId: object
    ) {
        this._currentUser.set(this.getStoredUser());
    }

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

        this._currentUser.set(user);

    }

    getStoredUser(): User | null {
        if(!isPlatformBrowser(this.platformId)) {
            return null;
        }

        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    clearSession(): void {
        if(isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
        }

        this._currentUser.set(null);
    }

    logout(): void {
        this.clearSession();
        this.router.navigate(["/auth/login"]);
    }

    isAuthenticated(): boolean {
        if (!isPlatformBrowser(this.platformId)) 
            return true;

        const token = localStorage.getItem(this.tokenKey);
        if (!token) 
            return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = Date.now() >= (payload.exp * 1000);

            if(!isExpired) 
                return true;
            
            this.logout();
            return false;
        } catch (e) {
            this.logout();
            return false;
        }
  }
}
