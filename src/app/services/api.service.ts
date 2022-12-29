import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IDownloadImg } from '../interfaces/downloadImg';
import { ILoginUser } from '../interfaces/loginUser';
import { IRegisterUser } from '../interfaces/registerUser';
import { UtilsService } from './util-services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private utilService: UtilsService) {}

  registeUser(user: any): Observable<IRegisterUser> {
    const formData = new FormData();

    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('age', user.age);
    formData.append('image', user.image);
    formData.append('password', user.password);
    formData.append('confirmPassword', user.confirmPassword);

    return this.http.post<IRegisterUser>(environment.BASE_URL + '/auth/register/user', formData)
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            this.utilService.showError(
              'Ocorreu um erro na aplicação, tente novamente!'
            );
          } else {
            this.utilService.showError(
              'Ocorreu um erro no servidor, tente mais tarde!'
            );
          }
          return throwError(() => err);
        })
      );
  }

  loginUser(user: any): Observable<ILoginUser>{
    return this.http.post<ILoginUser>(environment.BASE_URL + '/auth/login', user)
      .pipe(
        catchError((err) => {
          if(err.status === 0 && err.status !== 404){
            this.utilService.showError('Ocorreu um erro na aplicação, tente novamente!')
          }
            else if (err.status === 404) {
            this.utilService.showError(err.error.message);
          } else {
            this.utilService.showError(
              'Ocorreu um erro no servidor, tente mais tarde!'
            );
          }
          return throwError(() => err);
        })
      )
  }

  downloadImg(imgName: string ): Observable<IDownloadImg>{
    const headers = new HttpHeaders().set('imgName', imgName)

    return this.http.get<IDownloadImg>(environment.BASE_URL + '/download/image', {headers: headers})
    .pipe(
      catchError((err) => {
        if(err.status === 0 && err.status !== 404){
          this.utilService.showError('Ocorreu um erro na aplicação, tente novamente!')
        }
          else if (err.status === 404) {
          this.utilService.showError(err.error.message);
        } else {
          this.utilService.showError(
            'Ocorreu um erro no servidor, tente mais tarde!'
          );
        }
        return throwError(() => err);
      })
    )
  }
}
