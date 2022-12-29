import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-hour',
  template: '',
  styles: []
})
export class MessageHourComponent implements OnInit {
  @Output() messageHour = new EventEmitter();


  ngOnInit(): void {
    this.message()
  }

  message(){
    let hour = new Date().getHours()
    if(hour <= 4){
       this.messageHour.emit('Boa madrugada')
       return
    }
    if(hour < 12){
       this.messageHour.emit('Bom dia')
       return
   }
    if(hour < 18 ){
       this.messageHour.emit('Boa Tarde')
       return
   }
    this.messageHour.emit('Boa noite')
  }
}
