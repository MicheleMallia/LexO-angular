import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-lexicon-page',
  templateUrl: './lexicon-page.component.html',
  styleUrls: ['./lexicon-page.component.scss']
})
export class LexiconPageComponent implements OnInit {
  subscription: Subscription;
  object: any;
  constructor(private lexicalService: LexicalEntriesService) { }

  notes = '';
  link = [];
  bibliography = [];
  ngOnInit(): void {
    this.lexicalService.rightPanelData$.subscribe(
      object => {
        this.object = object;
        /* console.log(this.object) */
        if(this.object !=null){
          if(this.object.etymology != undefined){
            this.notes = this.object['etymology'];
            this.link = this.object['etymology'];
            this.bibliography = this.object['etymology'];
          }else{
            this.notes = this.object;
            this.link = this.object;
            this.bibliography = this.object;
          }
        }else{
          this.notes = null;
          this.link = null;
          this.bibliography = null;
        }
      }
    );
  }

}
