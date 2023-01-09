import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IDeleteRevenue } from '../interfaces/delete-revenue';
import { IDownloadImg } from '../interfaces/download-Img';
import { IListRevenues } from '../interfaces/list-revenue';
import { ILoginUser } from '../interfaces/login-user';
import { IRegisterRevenue } from '../interfaces/register-revenue';
import { IRegisterUser } from '../interfaces/register-user';
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

  registerRevenues(revenue: any): Observable<IRegisterRevenue>{
      return this.http.post<IRegisterRevenue>(environment.BASE_URL + '/auth/revenues', revenue)
      .pipe(
        catchError((err) => {
          return throwError(() => err)
        })
      )
  }

  getRegisterListRevenues(param: any, user: any): Observable<IListRevenues>{
    let headers = new HttpHeaders()
    headers = headers.set('month', param).set('user', user)

    return this.http.get<IListRevenues>(environment.BASE_URL + '/list/revenues', {headers: headers})
    .pipe(
      first(),
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

  deleteRevenues(id: string): Observable<IDeleteRevenue>{
      return this.http.delete<IDeleteRevenue>(environment.BASE_URL + '/delete/revenue/' + id)
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
