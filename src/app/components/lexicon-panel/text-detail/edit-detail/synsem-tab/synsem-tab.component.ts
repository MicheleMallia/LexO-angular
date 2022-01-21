import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ExpanderService } from 'src/app/services/expander/expander.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

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
        height: 'calc(100vh - 22rem)',
        
      })),
      state('out', style({
        height: 'calc(50vh - 12.5rem)',
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
          if(this.object.lexicalEntry != undefined && this.object.sense == undefined){
            this.isLexicalEntry = true;
            this.lexicalEntryData = object;
          }else if(this.object.form != undefined){
            this.isLexicalEntry = false;
            this.lexicalEntryData = null;
            this.object = null;
          }else if(this.object.sense != undefined){
            this.isLexicalEntry = false;
            this.lexicalEntryData = null;
            this.object = null;
          }
        }
      }
    );
    
    this.expand.expEdit$.subscribe(
      trigger => {
        if(trigger){
          let isEditExpanded = this.expand.isEditTabExpanded();
          let isEpigraphyExpanded = this.expand.isEpigraphyTabExpanded();

          if(!isEpigraphyExpanded){
            this.exp_trig = 'in';
            this.rend.setStyle(this.expander_body.nativeElement, 'height', 'calc(100vh - 22rem)')
            this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(100vh - 22rem)')
          }else{
            this.rend.setStyle(this.expander_body.nativeElement, 'height', 'calc(50vh - 12.5rem)');
            this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(50vh - 12.5rem)');
            this.exp_trig = 'in';
          }
          
        }else if(trigger==null){
          return;
        }else{
          this.rend.setStyle(this.expander_body.nativeElement, 'height', 'calc(50vh - 12.5rem)');
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(50vh - 12.5rem)');
          this.exp_trig = 'out';
        }
      }
    );

    this.expand.expEpigraphy$.subscribe(
      trigger => {
        if(trigger){
          this.exp_trig = 'in';
          this.rend.setStyle(this.expander_body.nativeElement, 'height', 'calc(50vh - 12.5rem)')
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(50vh - 12.5rem)')
        }else if(trigger==null){
          return;
        }else{
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(50vh - 12.5rem)');
          this.exp_trig = 'out';
        }
      }
    );
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
