import { Component, OnInit } from '@angular/core';
import { LexicalEntriesService } from '../../../../../services/lexical-entries.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-core-tab',
  templateUrl: './core-tab.component.html',
  styleUrls: ['./core-tab.component.scss']
})
export class CoreTabComponent implements OnInit {

  lock = 0;
  object: any;
  constructor(private lexicalService : LexicalEntriesService) { }

  ngOnInit(): void {
      this.lexicalService.item$.subscribe(
        object => this.object = object
    );
   }

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
