import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../services/login.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  let token: string|null = localStorage.getItem('token');;

  let headers = req.headers

  if(token){
    headers = headers.set('Authorization', 'Bearer' + token)
    LoginService.getInstance().setToken(token);
  }

  headers = headers.set('Accept', 'application/json')

  req = req.clone({headers: headers})

  return next(req);
};