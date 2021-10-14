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
  selector: 'app-etymology-tab',
  templateUrl: './etymology-tab.component.html',
  styleUrls: ['./etymology-tab.component.scss'],
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
export class EtymologyTabComponent implements OnInit {

  lock = 0;
  object: any;
  exp_trig = '';

  isLexicalEntry = false;
  isForm = false;
  isSense = false;
  isLexicalConcept = false;
  searchIconSpinner = false;
  goBack = false;

  etymologyData : any;


  lastUpdateDate : any;
  creationDate : any;
  creator : any;
  revisor : any;

  @ViewChild('expander') expander_body: ElementRef;

  constructor(private lexicalService: LexicalEntriesService, private expand: ExpanderService, private rend: Renderer2) { }

  ngOnInit(): void {
    this.lexicalService.coreData$.subscribe(
      object => {
        if(this.object != object){
          
        }
        this.object = object
        /* //console.log(this.object) */
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



  deleteEtymology(){
    
  }

  addNewEtymology(){
    
  }


  addNewForm(){
    this.searchIconSpinner = true;
    //console.log(this.object)
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
      //console.log(this.object);
      this.lexicalService.createNewForm(parentNodeInstanceName).subscribe(
        data=>{
          data['request'] = 2;
          data['parentNodeInstanceName'] = parentNodeInstanceName;
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
    }else if(this.isSense){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      let parentNodeLabel = this.object.parentNodeLabel;
      //console.log(this.object);
      this.lexicalService.createNewForm(parentNodeInstanceName).subscribe(
        data=>{
          data['request'] = 1;
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
    if(this.isLexicalEntry){
      let lexicalId = this.object.lexicalEntryInstanceName;
      this.lexicalService.createNewSense(lexicalId).subscribe(
        data=>{
          data['request'] = 1;
          data['parentNode'] = this.object.label; 
          data['whatToSearch'] = 'sense';
          data['instanceName'] = data['senseInstanceName'];
          this.searchIconSpinner = false;
          this.lexicalService.refreshAfterEdit(data);
          //this.lexicalService.refreshLexEntryTree();
        },error=> {
          this.searchIconSpinner = false;
          //this.lexicalService.refreshLexEntryTree();
        }
      )
    }else if(this.isSense){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      let parentNodeLabel = this.object.parentNodeLabel;
      //console.log(this.object);
      this.lexicalService.createNewSense(parentNodeInstanceName).subscribe(
        data=>{
          data['request'] = 7;
          data['parentNode'] = parentNodeLabel;
          data['parentNodeInstanceName'] = parentNodeInstanceName;
          data['whatToSearch'] = 'sense';
          data['instanceName'] = data['senseInstanceName'];
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
    }else if(this.isForm){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      let parentNodeLabel = this.object.parentNodeLabel;
      //console.log(this.object);
      this.lexicalService.createNewSense(parentNodeInstanceName).subscribe(
        data=>{
          data['request'] = 1;
          data['parentNode'] = parentNodeLabel;
          data['whatToSearch'] = 'sense';
          data['instanceName'] = data['senseInstanceName'];
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
}
