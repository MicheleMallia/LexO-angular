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
  ngOnInit(): void {
    this.lexicalService.rightPanelData$.subscribe(
      object => {
        this.object = object;
        if(this.object !=null){
          this.notes = this.object;
          this.link = this.object.links[0];
        }else{
          this.notes = null;
          this.link = null;
        }
      }
    );
  }

}
