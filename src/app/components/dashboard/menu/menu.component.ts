import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IDownloadImg } from 'src/app/interfaces/downloadImg';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage-services/localstorage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  showMessageHour!: string;
  showNameUser!: string;
  isDefaultImage ='../../../../assets/images/default.png'
  imageUser!:  SafeResourceUrl;


  constructor(
    private localStorageService: LocalStorageService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router){

  }

  ngOnInit(): void {
    this.getNameUser()
    this.getImageUser()
  }

  getImageUser(){
    const nameImage = this.localStorageService.getLocalStorage('userInfo')
    this.apiService.downloadImg(nameImage.image).subscribe((res: IDownloadImg) => {
      let url = 'data:image/jpg;base64,' + res.image
      this.imageUser = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    })
  }

  getMessageHour(message: string){
    this.showMessageHour = message
  }

  getNameUser(){
    const nameUser = this.localStorageService.getLocalStorage('userInfo')
    this.showNameUser = nameUser.name
  }

  logout(){
    this.localStorageService.removeLocalStorage('token')
    this.router.navigate(['/'])
  }
}
