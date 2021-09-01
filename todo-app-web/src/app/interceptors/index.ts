import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HeaderInterceptorInterceptor } from "./header-interceptor.interceptor";

export const httpInterceptProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorInterceptor, multi: true }
]