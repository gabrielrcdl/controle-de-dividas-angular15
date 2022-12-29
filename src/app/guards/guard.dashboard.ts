import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-services/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class GuardDashboard implements CanActivate {

  constructor(
     private localStorageService: LocalStorageService,
     private router: Router){}

  canActivate(): boolean{
    const userToken = (typeof this.localStorageService.getLocalStorage('token') !== 'object')

      if(userToken){
        return true
    }
      this.router.navigate(['/login'])
       return false
  }
}
