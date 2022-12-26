import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidations } from 'src/app/shared/material-module/validations/form-validations';

@Component({
  selector: 'app-continuation-register',
  templateUrl: './continuation-register.component.html',
  styleUrls: ['./continuation-register.component.scss'],
})
export class ContinuationRegisterComponent implements OnInit {
  form!: FormGroup;
  preview!: any;
  isDefault = true;
  isDefaultImg = '../../assets/images/default.png';
  public hideFieldOne = true;
  public hideConfirmPassword = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
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
}
