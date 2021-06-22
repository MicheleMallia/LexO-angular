import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LexicalEntriesService } from '../../../../../services/lexical-entries/lexical-entries.service';
import { ExpanderService } from 'src/app/services/expander/expander.service';

import {
  animate,
  style,
  transition,
  trigger,
  state
} from "@angular/animations";
import { debounceTime } from 'rxjs/operators';

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
  searchIconSpinner = false;
  goBack = false;

  lexicalEntryData : any;
  formData : any;
  senseData : any;
  lexicalConceptData : any;

  lastUpdateDate : any;
  creationDate : any;
  author : any;
  revisor : any;

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
          this.author = this.object.author;
          this.revisor = this.object.revisor;
          
          if(this.object.lexicalEntry != undefined && this.object.sense == undefined){
            this.isLexicalEntry = true;
            this.isForm = false;
            this.isSense = false;
            this.lexicalEntryData = object;
            this.formData = null;
            this.lexicalConceptData = null;
            this.isLexicalConcept = false;
          }else if(this.object.form != undefined && this.object.sense == undefined){
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
          }else if(this.object.lexicalConcept != undefined && this.object.sense == undefined){
            this.isLexicalEntry = false;
            this.isForm = false;
            this.isSense = false;
            this.isLexicalConcept = true;
            this.senseData = null;
            this.formData = null;
            this.lexicalEntryData = null;
            this.lexicalConceptData = object;
          }


          switch(this.object.status){
            case 'working' : {
              this.lock = 0; 
              setTimeout(() => {
                //@ts-ignore
                $('.locked-tooltip').tooltip('disable');
              }, 10);
              break;
            }
            case 'completed' : {
              this.lock = 1; 
              setTimeout(() => {
                //@ts-ignore
                $('.locked-tooltip').tooltip('disable');
              }, 10);
              break;
            }
            case 'reviewed' : {
              this.lock = 2;
              this.goBack = true;
              setTimeout(() => {
                //@ts-ignore
                $('.locked-tooltip').tooltip('enable');
                //@ts-ignore
                $('.locked-tooltip').tooltip({
                  trigger: 'hover'
                });
              }, 50);
              break;
            }
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
    );

    this.lexicalService.updateLexCardReq$.subscribe(
      data => {
        if(data != null){
          this.lastUpdateDate = data['lastUpdate']
          if(data['creationDate'] != undefined){
            this.creationDate = data['creationDate']
          }
        }
      }
    )

    this.lexicalService.spinnerAction$.subscribe(
      data => {
        if(data == 'on'){
          this.searchIconSpinner = true;
        }else{
          this.searchIconSpinner = false;
        }
      },
      error => {

      }
    )
  }

  changeStatus() {

    if(!this.goBack){
      this.lock++;
      if (this.lock == 2){
        this.goBack = true;
      }
    }else if(this.goBack){
      this.lock--;
      if (this.lock == 0){
        this.goBack = false;
      }
    }

    this.searchIconSpinner = true;
    let lexicalId = this.object.lexicalEntryInstanceName;
    
    switch(this.lock){
      case 0 : {
          let parameters = {
            relation : "status",
            value : "working"
          }
          this.lexicalService.updateLexicalEntry(lexicalId, parameters).pipe(debounceTime(500)).subscribe(
          data => {
            this.searchIconSpinner = false;
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            setTimeout(() => {
              //@ts-ignore
              $('.locked-tooltip').tooltip('disable');
            }, 10);
          },
          error => {
            this.searchIconSpinner = false;
            const data = this.object;
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            this.lexicalService.updateLexCard({lastUpdate : error.error.text})
            setTimeout(() => {
              //@ts-ignore
              $('.locked-tooltip').tooltip('disable');
            }, 10);
          }
        )
      }; break;
      case 1 : {
        let parameters = {
          relation : "status",
          value : "completed"
        }
        this.lexicalService.updateLexicalEntry(lexicalId, parameters).pipe(debounceTime(500)).subscribe(
          data => {

            this.searchIconSpinner = false;
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            setTimeout(() => {
              //@ts-ignore
              $('.locked-tooltip').tooltip('disable');
            }, 10);
          },
          error => {
            this.searchIconSpinner = false;
            const data = this.object;
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            this.lexicalService.updateLexCard({lastUpdate : error.error.text})
            setTimeout(() => {
              //@ts-ignore
              $('.locked-tooltip').tooltip('disable');
            }, 10);
          }
        )
      }; break;
      case 2 : {
        let parameters = {
          relation : "status",
          value : "reviewed"
        }
        this.lexicalService.updateLexicalEntry(lexicalId, parameters).pipe(debounceTime(500)).subscribe(
          data => {
            this.searchIconSpinner = false;
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            setTimeout(() => {
              //@ts-ignore
              $('.locked-tooltip').tooltip('enable');
              //@ts-ignore
              $('.locked-tooltip').tooltip({
                trigger: 'hover'
              });
            }, 50);
          },
          error => {
            
            this.searchIconSpinner = false;
            const data = this.object;
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            this.lexicalService.updateLexCard({lastUpdate : error.error.text})
            setTimeout(() => {
              //@ts-ignore
              $('.locked-tooltip').tooltip('enable');
              //@ts-ignore
              $('.locked-tooltip').tooltip({
                trigger: 'hover'
              });
            }, 50);
          }
        )
      }; break;
    }
    
  }

  deleteLexicalEntry(){
    this.searchIconSpinner = true;
    let lexicalId = this.object.lexicalEntryInstanceName
    this.lexicalService.deleteLexicalEntry(lexicalId).subscribe(
      data => {
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest();
        this.lexicalEntryData = null;
        this.isLexicalEntry = true;
        this.isForm = false;
        this.object = null;
      },
      error => {
      }
    )
  }

  deleteForm(){
    this.searchIconSpinner = true;
    let lexicalId = this.object.formInstanceName;
    this.lexicalService.deleteForm(lexicalId).subscribe(
      data=>{
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest();
        this.isForm = false;
        this.object = null;
      },error=> {
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest();
      }
    )
  }

  deleteSense(){
    this.searchIconSpinner = true;
    let lexicalId = this.object.senseInstanceName;
    this.lexicalService.deleteSense(lexicalId).subscribe(
      data=>{
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest();
        this.isSense = false;
        this.object = null;
      },error=> {
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest();
      }
    )
  }

  addNewForm(){
    this.searchIconSpinner = true;
    console.log(this.object)
    if(this.isLexicalEntry){
      let lexicalId = this.object.lexicalEntryInstanceName;
      this.lexicalService.createNewForm(lexicalId).subscribe(
        data=>{
          data['request'] = 1;
          data['parentNode'] = this.object.label; 
          data['whatToSearch'] = 'form';
          data['instanceName'] = data['formInstanceName']
          this.searchIconSpinner = false;
          this.lexicalService.refreshAfterEdit(data);
          //this.lexicalService.refreshLexEntryTree();
        },error=> {
          this.searchIconSpinner = false;
          //this.lexicalService.refreshLexEntryTree();
        }
      )
    }else if(this.isForm){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      let parentNodeLabel = this.object.parentNodeLabel;
      console.log(this.object);
      this.lexicalService.createNewForm(parentNodeInstanceName).subscribe(
        data=>{
          data['request'] = 2;
          data['parentNode'] = parentNodeLabel;
          data['whatToSearch'] = 'form';
          data['instanceName'] = data['formInstanceName'];
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.searchIconSpinner = false;
          this.lexicalService.refreshAfterEdit(data);
          //this.lexicalService.refreshLexEntryTree();
        },error=> {
          this.searchIconSpinner = false;
          //this.lexicalService.refreshLexEntryTree();
        }
      )
    }
    
  }

  addNewSense(){
    this.searchIconSpinner = true;
    let lexicalId = this.object.lexicalEntryInstanceName;
    this.lexicalService.createNewSense(lexicalId).subscribe(
      data=>{
        this.searchIconSpinner = false;
        this.lexicalService.refreshLexEntryTree();
      },error=> {
        this.searchIconSpinner = false;
        this.lexicalService.refreshLexEntryTree();
      }
    )
  }
}
