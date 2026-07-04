import { HttpClient } from "@angular/common/http";
import { environment } from "../../../config/environment.dev"
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { LoginRequest, LoginResponse } from "../interface/auth.interface";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly path = "/auth"
    private readonly apiUrl = `${environment.apiUrl}${this.path}`;
    private readonly tokenKey = "acess_token";

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

    logout(): void {
        if(isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
        }
    }
}