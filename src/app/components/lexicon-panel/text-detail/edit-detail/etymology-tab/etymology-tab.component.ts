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

import { ToastrService } from 'ngx-toastr';

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

  constructor(private lexicalService: LexicalEntriesService, private expand: ExpanderService, private rend: Renderer2, private toastr: ToastrService) { }

  ngOnInit(): void {
    
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

  showBiblioModal(){
    
  }


  addNewForm(){
    this.searchIconSpinner = true;
    /* console.log(this.object) */
    this.object['request'] = 'form'
    if(this.isLexicalEntry){
      let lexicalId = this.object.lexicalEntryInstanceName;
      this.lexicalService.createNewForm(lexicalId).subscribe(
        data=>{
          //console.log(data);
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
          this.searchIconSpinner = false;
        },error=> {
          //console.log(error)
          this.toastr.error(error.error, 'Error', {
            timeOut: 5000,
          });
          this.searchIconSpinner = false;
        }
      )
    }else if(this.isForm){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      //console.log(this.object);
      this.object['request'] = 'form';
      this.object['lexicalEntryInstanceName'] = parentNodeInstanceName
      this.lexicalService.createNewForm(parentNodeInstanceName).subscribe(
        data=>{
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
          this.searchIconSpinner = false;
        },error=> {
          //console.log(error)
          this.searchIconSpinner = false;
        }
      )
    }else if(this.isSense){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      this.object['request'] = 'form';
      this.object['lexicalEntryInstanceName'] = parentNodeInstanceName
      //console.log(this.object);
      this.lexicalService.createNewForm(parentNodeInstanceName).subscribe(
        data=>{
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
          this.searchIconSpinner = false;
        },error=> {
          this.searchIconSpinner = false;
        }
      )
    }
    
  }

  addNewSense(){
    this.searchIconSpinner = true;
    this.object['request'] = 'sense'
    if(this.isLexicalEntry){
      let lexicalId = this.object.lexicalEntryInstanceName;
      this.lexicalService.createNewSense(lexicalId).subscribe(
        data=>{
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
          this.searchIconSpinner = false;
        },error=> {
          this.searchIconSpinner = false;
          this.toastr.error(error.error, 'Error', {
            timeOut: 5000,
          });
          
        }
      )
    }else if(this.isSense){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      this.object['lexicalEntryInstanceName'] = parentNodeInstanceName
      this.object['request'] = 'sense'
      //console.log(this.object);
      this.lexicalService.createNewSense(parentNodeInstanceName).subscribe(
        data=>{
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
          this.searchIconSpinner = false;
        },error=> {
          this.searchIconSpinner = false;
        }
      )
    }else if(this.isForm){
      let parentNodeInstanceName = this.object.parentNodeInstanceName;
      this.object['lexicalEntryInstanceName'] = parentNodeInstanceName
      this.object['request'] = 'sense'
      //console.log(this.object);
      this.lexicalService.createNewSense(parentNodeInstanceName).subscribe(
        data=>{
          if(data['creator'] == this.object.creator){
            data['flagAuthor'] = false;
          }else{
            data['flagAuthor'] = true;
          }
          this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
          this.searchIconSpinner = false;
          //this.lexicalService.refreshLexEntryTree();
        },error=> {
          this.searchIconSpinner = false;
          //this.lexicalService.refreshLexEntryTree();
        }
      )
    }
  }
  
}
