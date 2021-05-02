import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LexicalEntriesService } from '../../../../../services/lexical-entries.service';
import { ExpanderService } from 'src/app/services/expander.service';

import {
  animate,
  style,
  transition,
  trigger,
  state
} from "@angular/animations";

@Component({
  selector: 'app-core-tab',
  templateUrl: './core-tab.component.html',
  styleUrls: ['./core-tab.component.scss'],
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
export class CoreTabComponent implements OnInit {

  lock = 0;
  object: any;
  exp_trig = '';

  isLexicalEntry = false;
  isForm = false;
  isSense = false;
  isLexicalConcept = false;

  lexicalEntryData : any;
  formData : any;
  senseData : any;
  lexicalConceptData : any;

  @ViewChild('expander') expander_body: ElementRef;

  constructor(private lexicalService: LexicalEntriesService, private expand: ExpanderService, private rend: Renderer2) { }

  ngOnInit(): void {
    this.lexicalService.coreData$.subscribe(
      object => {
        if(this.object != object){
          this.lexicalEntryData = null;
          this.formData = null;
          this.senseData = null;
        }
        this.object = object
        
        if(this.object != null){
          if(this.object.lexicalEntry != undefined){
            this.isLexicalEntry = true;
            this.isForm = false;
            this.isSense = false;
            this.lexicalEntryData = object;
            this.formData = null;
            this.lexicalConceptData = null;
            this.isLexicalConcept = false;
          }else if(this.object.form != undefined){
            this.isLexicalEntry = false;
            this.isForm = true;
            this.isSense = false;
            this.formData = object;
            this.lexicalEntryData = null;
            this.lexicalConceptData = null;
            this.isLexicalConcept = false;
          }else if(this.object.sense != undefined){
            this.isLexicalEntry = false;
            this.isForm = false;
            this.isSense = true;
            this.senseData = object;
            this.formData = null;
            this.lexicalEntryData = null;
            this.lexicalConceptData = null;
            this.isLexicalConcept = false;
          }else if(this.object.lexicalConcept != undefined){
            this.isLexicalEntry = false;
            this.isForm = false;
            this.isSense = false;
            this.isLexicalConcept = true;
            this.senseData = null;
            this.formData = null;
            this.lexicalEntryData = null;
            this.lexicalConceptData = object;
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

    if(this.lock==2){
      setTimeout(() => {
        //@ts-ignore
        $('.locked-tooltip').tooltip({
          trigger: 'hover'
        });
      }, 10);
    }else if(this.lock < 2){
      setTimeout(() => {
        //@ts-ignore
        $('.locked-tooltip').tooltip('disable');
      }, 10);
    }
    
  }
}
