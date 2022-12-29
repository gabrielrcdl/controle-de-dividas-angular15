import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ILoginUser } from 'src/app/interfaces/loginUser';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage-services/localstorage.service';
import { UtilsService } from 'src/app/services/util-services/utils.service';
import { ContinuationRegisterComponent } from '../continuation-register/continuation-register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formRegister!: FormGroup;
  formLogin!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>()
  public hideField = true;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private utilService: UtilsService,
    private router: Router) {}

  ngOnInit() {
    this.initForms();
  }


  initForms() {
    this.formRegister = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      age: [null, Validators.required],
    });

    this.formLogin = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    })
  }

  isValidForm(): boolean {
    return this.formLogin.valid;
  }

  createPayload(
    email = this.getValueControl(this.formLogin, 'email'),
    password = this.getValueControl(this.formLogin, 'password'))
  {
      const payload = {
        email,
        password
      }
      return payload
  }


  login(){
    if(this.isValidForm()){
        const {email} = this.createPayload()
        this.apiService.loginUser(this.createPayload())
        // Se takeUntil desinscreve quando for true
        .pipe(takeUntil((this.destroy$)))
        .subscribe((res: ILoginUser) => {
          const {token} = res
          this.localStorageService.setLocalStorage('token', JSON.stringify(token))
          this.localStorageService.setLocalStorage('user', JSON.stringify(email))
          this.utilService.showSuccess('Login realizado com sucesso!')
          this.navigateUrl('dashboard')

        })

    }
  }

  openDialogRegister() {
    this.dialog.open(ContinuationRegisterComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        data: this.createDataDialog(),
      },
    });
  }

  getValueControl(form: FormGroup, control: string) {
    return form.controls[control].value;
  }

  createDataDialog(
    name = this.getValueControl(this.formRegister, 'name'),
    email = this.getValueControl(this.formRegister, 'email'),
    age = this.getValueControl(this.formRegister, 'age')
  ) {
    const dataDialog = {
      name,
      email,
      age,
    };
    return dataDialog;
  }

  navigateUrl(url: string){
    this.router.navigate([`/${url}`])
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
