import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as Recogito from '@recogito/recogito-js';
import { ExpanderService } from 'src/app/services/expander/expander.service';


@Component({
  selector: 'app-epigraphy-tab',
  templateUrl: './epigraphy-tab.component.html',
  styleUrls: ['./epigraphy-tab.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: 'calc(100vh - 13.5rem)',
        
      })),
      state('out', style({
        height: 'calc(50vh - 12rem)',
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})

export class EpigraphyTabComponent implements OnInit {
  exp_trig = '';
  @ViewChild('expanderEpigraphy') expander_body: ElementRef;

  constructor(private expand : ExpanderService, private rend: Renderer2) { }

  ngOnInit(): void {
    console.log('My Content: ' + document.getElementById('pippo'));

    var r = Recogito.init({
      content: document.getElementById('pippo'), // Element id or DOM node to attach to
      locale: 'auto',
      widgets: [
        /* I intend to include this plugin this way.
        { widget: Recogito.CommentsMention, userSuggestions: users }, */
        { widget: 'COMMENT' },
        { widget: 'TAG', vocabulary: ['Place', 'Person', 'Event', 'Organization', 'Animal'] }
      ],
      /* relationVocabulary: ['isRelated', 'isPartOf', 'isSameAs '] */
    });

    // Add an event handler  
    r.on('createAnnotation', function (annotation) {
      console.log('Annotation Added: ' + JSON.stringify(annotation))
    });

    r.on('selectAnnotation', function(a) {
      console.log('selected', a);
    });

    r.on('updateAnnotation', function(annotation, previous) {
      console.log('updated', previous, 'with', annotation);
    });

    // Switch annotation mode (annotation/relationships)
    var annotationMode = 'ANNOTATION'; // or 'RELATIONS'

    var toggleModeBtn = document.getElementById('toggle-mode');
    toggleModeBtn.addEventListener('click', function() {
      if (annotationMode === 'ANNOTATION') {
        toggleModeBtn.innerHTML = 'MODE: RELATIONS';
        annotationMode = 'RELATIONS';
      } else  {
        toggleModeBtn.innerHTML = 'MODE: ANNOTATION';
        annotationMode = 'ANNOTATION';
      }

      r.setMode(annotationMode);
    });

    this.expand.expEdit$.subscribe(
      trigger => {
        if(trigger){
          this.rend.setStyle(this.expander_body.nativeElement, 'height', 'calc(50vh - 12rem)')
          this.exp_trig = 'in';
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(100vh - 13.5rem)')
        }else if(trigger==null){
          return;
        }else{
          this.rend.setStyle(this.expander_body.nativeElement, 'max-height', 'calc(50vh - 12rem)');
          this.exp_trig = 'out';
        }
      }
    );
  }

  

}
