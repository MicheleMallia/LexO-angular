import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LexicalEntriesService } from '../../../../../services/lexical-entries/lexical-entries.service';
import { ExpanderService } from 'src/app/services/expander/expander.service';
import { ToastrService } from 'ngx-toastr';

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
  creator : any;
  revisor : any;

  @ViewChild('expander') expander_body: ElementRef;

  constructor(private lexicalService: LexicalEntriesService, private expand: ExpanderService, private rend: Renderer2, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.lexicalService.coreData$.subscribe(
      object => {
        if(this.object != object){
          this.lexicalEntryData = null;
          this.formData = null;
          this.senseData = null;
        }
        this.object = object
        /* //console.log(this.object) */
        if(this.object != null){
          this.creator = this.object.creator;
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
              this.goBack = false;
              setTimeout(() => {
                //@ts-ignore
                $('.locked-tooltip').tooltip('disable');
              }, 10);
              break;
            }
            case 'completed' : {
              this.lock = 1; 
              this.goBack = false;
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

    //console.log(this.goBack)

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
    //console.log(this.lock)
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
      data=>{
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest(this.object);
        this.lexicalEntryData = null;
        this.isLexicalEntry = false;
        this.object = null;
        this.lexicalService.refreshLangTable();
        this.lexicalService.refreshFilter({request : true})
        this.lexicalService.sendToRightTab(null);
      },error=> {
        this.searchIconSpinner = false;
        //this.lexicalService.deleteRequest(this.object);
        //this.lexicalService.refreshLangTable();
        //this.lexicalService.refreshFilter({request : true})
        this.toastr.error(error.error, 'Error', {
          timeOut: 5000,
        });
      }
    )
  }

  deleteForm(){
    this.searchIconSpinner = true;
    let lexicalId = this.object.formInstanceName;    
    this.lexicalService.deleteForm(lexicalId).subscribe(
      data=>{
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest(this.object);
        this.isForm = false;
        this.object = null;
      },error=> {
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest(this.object);
      }
    )
  }

  deleteSense(){
    this.searchIconSpinner = true;
    let lexicalId = this.object.senseInstanceName;
    
    this.lexicalService.deleteSense(lexicalId).subscribe(
      data=>{
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest(this.object);
        this.isSense = false;
        this.object = null;
      },error=> {
        this.searchIconSpinner = false;
        this.lexicalService.deleteRequest(this.object);
      }
    )
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

  addNewEtymology(){
    
  }
}
