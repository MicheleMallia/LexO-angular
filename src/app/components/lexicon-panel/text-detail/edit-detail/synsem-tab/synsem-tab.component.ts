import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ExpanderService } from 'src/app/services/expander.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';

import {
  animate,
  style,
  transition,
  trigger,
  state
} from "@angular/animations";

@Component({
  selector: 'app-synsem-tab',
  templateUrl: './synsem-tab.component.html',
  styleUrls: ['./synsem-tab.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '68vh',
        
      })),
      state('out', style({
        height: '42vh',
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class SynsemTabComponent implements OnInit {

  lock = 0;
  object: any;
  exp_trig = '';
  lexicalEntryData : any;
  isLexicalEntry = false;

  @ViewChild('expander') expander_body: ElementRef;

  constructor(private lexicalService: LexicalEntriesService, private expand: ExpanderService, private rend : Renderer2) { }

  ngOnInit(): void {
    this.lexicalService.coreData$.subscribe(
      object => {
        if(this.object != object){
          this.lexicalEntryData = null;
        }
        this.object = object
        
        if(this.object != null){
          if(this.object.lexicalEntry != undefined){
            this.isLexicalEntry = true;
            this.lexicalEntryData = object;
          }else if(this.object.form != undefined){
            this.isLexicalEntry = false;
            this.lexicalEntryData = null;
          }
        }
      }
    );
    
    this.expand.exp$.subscribe(
      trigger => {
        if(trigger){
          this.rend.setStyle(this.expander_body.nativeElement, 'height', '42vh')
          this.exp_trig = 'in';
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', '68vh')
        }else if(trigger==null){
          return;
        }else{
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', '42vh');
          this.exp_trig = 'out';
        }
      }
    )
  }

  changeStatus() {
    if (this.lock < 2) {
      this.lock++;
    } else if (this.lock > 1) {
      this.lock--;
    }
    setTimeout(() => {
      //@ts-ignore
      $('.locked-tooltip').tooltip({
        trigger: 'hover'
      });
    }, 10);
  }

}
