import { Component, OnInit } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';

@Component({
  selector: 'app-vartrans-tab',
  templateUrl: './vartrans-tab.component.html',
  styleUrls: ['./vartrans-tab.component.scss']
})
export class VartransTabComponent implements OnInit {

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
