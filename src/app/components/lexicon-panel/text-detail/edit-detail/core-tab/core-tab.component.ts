import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LexicalEntriesService } from '../../../../../services/lexical-entries.service';
import { Subscription } from 'rxjs';
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
        height: '54vh',
        
      })),
      state('out', style({
        height: '30vh',
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
  @ViewChild('expander') expander_body: ElementRef;

  constructor(private lexicalService: LexicalEntriesService, private expand: ExpanderService, private rend: Renderer2) { }

  ngOnInit(): void {
    this.lexicalService.coreData$.subscribe(
      object => this.object = object
    );

    this.expand.exp$.subscribe(
      trigger => {
        if(trigger){
          this.rend.setStyle(this.expander_body.nativeElement, 'height', '30vh')
          this.exp_trig = 'in';
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', '54vh')
        }else if(trigger==null){
          return;
        }else{
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', '30vh');
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
