import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-tab',
  templateUrl: './core-tab.component.html',
  styleUrls: ['./core-tab.component.scss']
})
export class CoreTabComponent implements OnInit {

  lock = 0;
  constructor() { }

  ngOnInit(): void { }

  changeStatus(){
    console.log(this.lock)
    this.lock++;
    if(this.lock > 2){
      this.lock =2 ;
    }
    setTimeout(() => {
      //@ts-ignore
      $('.locked-tooltip').tooltip({
        trigger : 'hover'
      });
    }, 10);
  }
}
