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
      this.lexicalService.coreData$.subscribe(
        object => this.object = object
    );
   }

  changeStatus(){
    if(this.lock < 2){
      this.lock++;
    }else if(this.lock > 1){
      this.lock--;
    }
    setTimeout(() => {
      //@ts-ignore
      $('.locked-tooltip').tooltip({
        trigger : 'hover'
      });
    }, 10);
  }
}
