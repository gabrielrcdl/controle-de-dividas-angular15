import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputWidth]'
})
export class InputWidthDirective {

  constructor(private el: ElementRef) {

   }

   @HostListener('focus') onFocus(){
    this.el.nativeElement.style.width =  '42%'
    this.el.nativeElement.classList.add('animationCard')
   }
   @HostListener('blur') onBlur(){
    this.el.nativeElement.style.width =  '170px'
   }


}
