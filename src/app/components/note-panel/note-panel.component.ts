import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrls: ['./note-panel.component.scss']
})
export class NotePanelComponent implements OnInit, OnChanges {

  @Input() noteData: string;
  object : any;
  private subject : Subject<string> = new Subject();
  

  htmlContent : '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: '150px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'strikeThrough',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };
  constructor(private lexicalService: LexicalEntriesService) { }

  ngOnInit(): void {
    this.editorConfig.editable = false;
    this.subject.pipe(debounceTime(1000)).subscribe(
      newNote => {
        if(this.noteData != null){
          this.lexicalService.spinnerAction('on');
          console.log(this.object)
          if(this.object.lexicalEntryInstanceName != undefined){
            var lexId = this.object.lexicalEntryInstanceName;
            var parameters = {
              relation : "note",
              value : newNote
            }
            this.lexicalService.updateLexicalEntry(lexId, parameters).subscribe(
              data => {
                console.log(data);
                this.lexicalService.spinnerAction('off');
              },
              error => {
                console.log(error);
                this.lexicalService.updateLexCard({lastUpdate : error.error.text})
                this.lexicalService.spinnerAction('off');
              }
            )
          }else if(this.object.formInstanceName != undefined){
            var formId = this.object.formInstanceName;
            var parameters = {
              relation : "note",
              value : newNote
            }
            this.lexicalService.updateForm(formId, parameters).subscribe(
              data => {
                console.log(data);
                this.lexicalService.spinnerAction('off');
              },
              error => {
                console.log(error);
                this.lexicalService.updateLexCard({lastUpdate : error.error.text})
                this.lexicalService.spinnerAction('off');
              }
            )
          }else if(this.object.senseInstanceName != undefined){
            var senseId = this.object.senseInstanceName;
            var parameters = {
              relation : "note",
              value : newNote
            }
            this.lexicalService.updateSense(senseId, parameters).subscribe(
              data => {
                console.log(data);
                this.lexicalService.spinnerAction('off');
              },
              error => {
                console.log(error);
                this.lexicalService.updateLexCard({lastUpdate : error.error.text})
                this.lexicalService.spinnerAction('off');
              }
            )
          }
        }
      }
    )

    this.lexicalService.deleteReq$.subscribe(
      data => {
        this.editorConfig.editable = false;
        this.noteData = null;
        this.object = null;
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) { 
    
      if(changes.noteData.currentValue == null){
        this.editorConfig.editable = false;
        this.noteData = null;
        this.object = null;
      }else{
        this.editorConfig.editable = true;
        this.noteData = changes.noteData.currentValue.note;
        this.object = changes.noteData.currentValue;
      }
      
      console.log(changes)
    
  }

  onChanges(evt){
    this.subject.next(this.noteData);
  }

}
