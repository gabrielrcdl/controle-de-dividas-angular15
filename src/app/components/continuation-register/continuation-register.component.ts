import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pipe, Subject, takeUntil } from 'rxjs';
import { IRegisterUser } from 'src/app/interfaces/registerUser';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage-services/localstorage.service';

import { UtilsService } from 'src/app/services/util-services/utils.service';
import { FormValidations } from 'src/app/shared/material-module/validations/form-validations';

@Component({
  selector: 'app-continuation-register',
  templateUrl: './continuation-register.component.html',
  styleUrls: ['./continuation-register.component.scss'],
})
export class ContinuationRegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  preview!: any;
  isDefault = true;
  isDefaultImg = '../../assets/images/default.png';
  destroy$: Subject<boolean> = new Subject<boolean>();
  public hideFieldOne = true;
  public hideConfirmPassword = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private utilService: UtilsService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [this.data.data?.name, Validators.required],
      email: [this.data.data?.email, [Validators.required, Validators.email]],
      age: [this.data.data?.age, Validators.required],
      avatar: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [
        null,
        [Validators.required, FormValidations.equalsTo('password')],
      ],
    });
  }

  onChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.isDefault = false;
      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e) => (this.preview = reader.result);

      reader.readAsDataURL(file);

      this.form.patchValue({
        avatar: file,
      });
    }
  }

  createFormPayload(
    name = this.getValueControl(this.form, 'name'),
    email = this.getValueControl(this.form, 'email'),
    age = this.getValueControl(this.form, 'age'),
    image = this.getValueControl(this.form, 'avatar'),
    password = this.getValueControl(this.form, 'password'),
    confirmPassword = this.getValueControl(this.form, 'confirmPassword')
  ) {
    const payload = {
      name,
      email,
      age,
      image,
      password,
      confirmPassword,
    };
    return payload;
  }

  getValueControl(form: FormGroup, control: string) {
    return form.controls[control].value;
  }

  submit() {
    if (this.isValidForm()) {
      this.apiService
        .registeUser(this.createFormPayload())
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: IRegisterUser) => {
          this.utilService.showSuccess(res.message);
          this.localStorageService.setLocalStorage(
            'userInfo',
            JSON.stringify(res.user)
          );
          this.refreshPage();
        });
    }
  }

  isValidForm(): boolean {
    return this.form.valid;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  refreshPage() {
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}
