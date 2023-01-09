
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IDeleteRevenue } from 'src/app/interfaces/delete-revenue';
import { IListRevenues } from 'src/app/interfaces/list-revenue';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage-services/localstorage.service';
import { UtilsService } from 'src/app/services/util-services/utils.service';
import { StoreService } from 'src/app/shared/store.service';
import { AddRevenuesComponent } from '../add-revenues/add-revenues.component';
import { UpdateRevenuesComponent } from '../update-revenues/update-revenues.component';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.scss']
})
export class RevenuesComponent implements OnInit, AfterViewInit {
  monthSelected!: string;
  user!: string;
  loading = false;
  emptyResult = false;
  arrRevenues: any[] = [];
  displayedColumns: string[] = [
    'tipoReceita',
    'valor',
    'dataEntrada',
    '_id',
    'acoes'
  ]
  public dataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator!: MatPaginator

  constructor(
    private dialog: MatDialog,
    private storeService: StoreService,
    private localStorage: LocalStorageService,
    private apiService: ApiService,
    private utilsService: UtilsService
    ){}



  ngOnInit(){
    this.storeService.getStoreRevenues().subscribe(res => {
      if(res){
       this.getRegisterRevenues(this.monthSelected)
       }
    })
  }

  ngAfterViewInit(){
    this.storeService.getStoreMonth().subscribe(res => {
      this.monthSelected = res;
    })
    this.getRegisterRevenues(this.monthSelected)
  }

   getRegisterRevenues(monthSelected: string){
     this.user = this.localStorage.getLocalStorage('user')
     this.apiService.getRegisterListRevenues(monthSelected, this.user)
       .subscribe((res: IListRevenues) =>{
          this.loading = true

          let arr: any[] = []

          if(res.result.length === 0){
            this.emptyResult = true;
            this.arrRevenues = []
          }
          else{
            this.emptyResult = false;
            this.arrRevenues  = arr;

            setTimeout(() => {
                this.dataSource.paginator = this.paginator
            }, 2001)
            res.result.forEach((element: any) => {
              arr.push(element.user.month.listMonth)
            })
          }
           setTimeout(() => {
            this.dataSource.data = arr
            this.dataSource.paginator  = this.paginator
            this.loading = false
          }, 2000);
       })
   }

  openDialog(){
      this.dialog.open(AddRevenuesComponent, {
        width: '600px',
        data: {
          any: ''
        }
    })
  }

  applyFilter(event: any){
    const filterValues = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValues.trim().toLocaleLowerCase();
  }
  selectAction(action: string, element: any){
    if(action.indexOf('edit.png') != -1){
      this.dialog.open(UpdateRevenuesComponent,{
        width: '600px',
        data: {
          data: element
        }
      })
    }
    else{
      const question = confirm('Deseja realmente excluir essa receita?')
      if(question){
          this.apiService.deleteRevenues(element._id)
            .subscribe((res: IDeleteRevenue) => {
                this.storeService.setStoreRevenues(true)
                this.utilsService.showSuccess('Receita excluída com sucesso!')
            })
      }
    }
  }
}
