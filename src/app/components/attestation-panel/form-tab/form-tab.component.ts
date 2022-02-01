import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-form-tab',
  templateUrl: './form-tab.component.html',
  styleUrls: ['./form-tab.component.scss']
})
export class FormTabComponent implements OnInit, OnChanges {

  @Input() formData: any;
  object : any;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore
      $('.citational-tooltip').tooltip({
        trigger : 'click'
      });
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges) { 
    
    
   if(changes.formData.currentValue != null){
      console.log(changes);
      this.object = changes.formData.currentValue[0]
    }
  
  }

}
