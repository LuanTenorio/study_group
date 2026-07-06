import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

    private platformId = inject(PLATFORM_ID);

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!isPlatformBrowser(this.platformId))
            return EMPTY;

        const token = this.authService.getToken()

        if (!token) 
            return next.handle(req)

        const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        })

        return next.handle(authReq)
    }
}
