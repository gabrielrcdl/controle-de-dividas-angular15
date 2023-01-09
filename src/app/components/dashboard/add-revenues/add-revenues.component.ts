import { DialogRef } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryRevenues } from 'src/app/interfaces/category-revenue';

import { IRegisterRevenue } from 'src/app/interfaces/register-revenue';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage-services/localstorage.service';
import { UtilsService } from 'src/app/services/util-services/utils.service';
import { StoreService } from 'src/app/shared/store.service';


@Component({
  selector: 'app-add-revenues',
  templateUrl: './add-revenues.component.html',
  styleUrls: ['./add-revenues.component.scss']
})
export class AddRevenuesComponent implements OnInit {
  form!: FormGroup;
  revenueTypeModel!: string
  revenues!: ICategoryRevenues[]
  month!: string
  months: string[] = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

    constructor(
      private fb: FormBuilder,
      private localStorageService: LocalStorageService,
      private storeService: StoreService,
      private apiService: ApiService,
      private utilService: UtilsService,
      private dialogRef: DialogRef<AddRevenuesComponent>,
      @Inject(DOCUMENT) private document: any
      ){}



  ngOnInit(){
    this.initForm()
    this.revenues = [
      {
        name: 'Investimentos'
      },
      {
        name: 'Estudos'
      },
      {
        name: 'Férias'
      },
      {
        name: '13 Salário'
      },
      {
        name: 'PLR'
      },
      {
        name: 'Aluguel'
      },
      {
        name: 'Salário'
      },
      {
        name: 'Outros'
      },
    ]

    this.storeService.getStoreMonth().subscribe(res => {
      this.month = res
    });

    this.preventFutureDate()
  }

  initForm(){

      this.form = this.fb.group({
        revenueType: [null, Validators.required],
        value: [null, Validators.required],
        entryDate: [null, Validators.required],
        fixedRevenue: [null]
      })
  }

  preventFutureDate(){
    const inputDate = this.document.querySelector("#dateEntry")

    let date = new Date()

    let month: any = date.getMonth() + 1
    let day: any = date.getDate()
    let year: any = date.getFullYear()

    if(month < 10){
      month = '0' + month.toString()
    }
    if(day < 10){
      day = '0' + day.toString()
    }
    let maxDate = year + '-' + month + '-' + day;
    inputDate.max = maxDate
  }

  submit(){
    this.form.patchValue({
      revenueType: this.revenueTypeModel
    })

    if(this.isValidForm()){
      let typeRevenue = this.getValueControl(this.form, 'revenueType')
      let value = this.getValueControl(this.form, 'value')
      let user = this.localStorageService.getLocalStorage('user')

      const date = this.getValueControl(this.form, 'entryDate')

      const dateReplaceBR = date
        .replaceAll('-', '$')
        .replaceAll(' ', '$')
        .split('$')

        let fixedMonth = Number(dateReplaceBR[1] - 1)
        let newDate = new Date(dateReplaceBR[0], fixedMonth, dateReplaceBR[2])

        const monthDateSelected = newDate.toLocaleDateString('pt-br', {
          month: 'long'
        })

        const convertUpperCase = monthDateSelected[0].toUpperCase() + monthDateSelected.substring(1)

        let indexMonthCurrent = this.searchIndexMonth(convertUpperCase)
        let dateEntry = new Date(dateReplaceBR[0], indexMonthCurrent, dateReplaceBR[2])

        const payload = {
          user:{
            title: user,
            month:{
              title: this.month,
              listMonth:{
                typeRevenue,
                value,
                dateEntry
              }
            }
          }
      }

      // Se receita for marcada como fixa.
      if(this.getValueControl(this.form, 'fixedRevenue')){
        for(let i = 0; i < this.months.length; i++){
          dateEntry = new Date(dateReplaceBR[0]), this.searchIndexMonth(this.months[i]), dateReplaceBR[2]
          const payload = {
            user:{
              title: user,
              month:{
                title: this.months[i],
                listMonth:{
                  typeRevenue,
                  value,
                  dateEntry
              }
            }
          }
        }
        this.apiService.registerRevenues(payload).subscribe()
        this.storeService.setStoreRevenues(true)
        this.dialogRef.close();
      }
    }


      this.apiService.registerRevenues(payload)
      .subscribe( (res : IRegisterRevenue) => {
         if(res){
          this.storeService.setStoreRevenues(true)
         }
      })
      this.dialogRef.close();

    }
  }

  isValidForm(): boolean{
    return this.form.valid
  }

  getValueControl(form: FormGroup, control: string){
      return form.controls[control].value
  }

  searchIndexMonth(monthSearch: any){
    let index  = this.months.findIndex((month) => {
      return month === monthSearch
    })
    return index
  }
}
