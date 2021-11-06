import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { BibliographyService } from 'src/app/services/bibliography-service/bibliography.service';
import { ModalComponent } from 'ng-modal-lib';

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
  isEtymology = false;



  lastUpdateDate : any;
  creationDate : any;
  creator : any;
  revisor : any;

  lexicalEntryData : any;
  formData : any;
  senseData : any;
  lexicalConceptData : any;
  bibliography = [];

  start = 0;
  sortField = 'title';
  direction = 'asc';
  memorySort = {field : '', direction : ''}
  queryTitle = '';
  queryMode = 'titleCreatorYear';

  selectedItem;

  @ViewChild('expander') expander_body: ElementRef;
  @Input() etymologyData: any;
  @ViewChild('addBibliography', {static: false}) modal: ModalComponent;
  @ViewChild('table_body') tableBody: ElementRef;

  constructor(private lexicalService: LexicalEntriesService, private biblioService : BibliographyService, private expand: ExpanderService, private rend: Renderer2, private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.lexicalService.etymologyData$.subscribe(
      object => {
        if(this.object != object){
          this.etymologyData = null;
          this.isForm = false;
          this.isLexicalConcept = false;
          this.isLexicalEntry = false;
        }
        this.object = object
        //console.log(this.object)
        if(this.object != null){
          this.creator = this.object['etymology'].creator;
          this.revisor = this.object.revisor;
          this.etymologyData = object;
         this.isEtymology = true;
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

    //@ts-ignore
    $("#biblioModal").modal("show");
    $('.modal-backdrop').appendTo('.ui-modal');
    //@ts-ignore
    $('#biblioModal').modal({backdrop: 'static', keyboard: false})  
    
    $('.modal-backdrop').css('height', 'inherit');
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");

    this.biblioService.bootstrapData(this.start, this.sortField, this.direction).subscribe(
      data=> {
        this.memorySort = {field : this.sortField, direction : this.direction}
        this.bibliography = data;
        this.bibliography.forEach(element => {
          element['selected'] = false;
        })
        
        
        //@ts-ignore
        $('#biblioModal').modal('hide');
        $('.modal-backdrop').remove();
      },error=>{
        console.log(error)
      }
    )
  }



  deleteEtymology(){
    
  }

  addNewEtymology(){
    this.searchIconSpinner = true;
    this.object['request'] = 'etymology'
    
    
    let parentNodeInstanceName = this.object.parentNodeInstanceName;
    this.object['lexicalEntryInstanceName'] = parentNodeInstanceName
    this.object['request'] = 'etymology'
    
    console.log(this.object, parentNodeInstanceName)
    this.lexicalService.createNewEtymology(parentNodeInstanceName).subscribe(
      data=>{
        console.log(data)
        if(data['creator'] == this.object.creator){
          data['flagAuthor'] = false;
        }else{
          data['flagAuthor'] = true;
        }
        this.lexicalService.addSubElementRequest({'lex' : this.object, 'data' : data});
        this.searchIconSpinner = false;
      },error=> {
        console.log(error)
        this.searchIconSpinner = false;
      }
    )

  }

  showBiblioModal(){
    this.modal.show();
  }

  checkIfCreatorExist(item?){
    return item.some(element => element.creatorType === 'author')
  }

  searchBibliography(query?:string, queryMode?:any){
    this.start = 0;
    this.selectedItem = null;
    //@ts-ignore
    $("#biblioModal").modal("show");
    $('.modal-backdrop').appendTo('.-body');
    //@ts-ignore
    $('#biblioModal').modal({backdrop: 'static', keyboard: false})  
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");
    this.tableBody.nativeElement.scrollTop = 0;
    if(this.queryTitle != ''){
      this.biblioService.filterBibliography(this.start, this.sortField, this.direction, this.queryTitle, this.queryMode).subscribe(
        data => {
          console.log(data);
          this.bibliography = [];
          data.forEach(element => {
            this.bibliography.push(element)
          });
          //@ts-ignore
          $('#biblioModal').modal('hide');
          $('.modal-backdrop').remove();
        },
        error => {
          console.log(error)
        }
      )
    }else{
      this.biblioService.filterBibliography(this.start, this.sortField, this.direction, this.queryTitle, this.queryMode).subscribe(
        data => {
          console.log(data);
          this.bibliography = [];
          data.forEach(element => {
            this.bibliography.push(element)
          });
          //@ts-ignore
          $('#biblioModal').modal('hide');
          $('.modal-backdrop').remove();
        },
        error => {
          console.log(error)
        }
      )
    }
  }

  onScrollDown(){
    //@ts-ignore
    $("#biblioModal").modal("show");
    $('.modal-backdrop').appendTo('.table-body');
    //@ts-ignore
    $('#biblioModal').modal({backdrop: 'static', keyboard: false})  
    $('.modal-backdrop').appendTo('.table-body');
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");

    this.start += 25;
    
    if(this.queryTitle != ''){
      this.biblioService.filterBibliography(this.start, this.sortField, this.direction, this.queryTitle, this.queryMode).subscribe(
        data=>{
          console.log(data)
          //@ts-ignore
          $('#biblioModal').modal('hide');
          $('.modal-backdrop').remove();
          data.forEach(element => {
            this.bibliography.push(element)
          });
        },error=>{
          console.log(error)
        }
      )
    }else{
      this.biblioService.filterBibliography(this.start, this.sortField, this.direction, this.queryTitle, this.queryMode).subscribe(
        data=> {
          
          data.forEach(element => {
            this.bibliography.push(element)
          });
                  
          //@ts-ignore
          $('#biblioModal').modal('hide');
          $('.modal-backdrop').remove();
        },error=>{
          console.log(error)
        }
      );
    }

    
  }

  selectItem(evt, i){
    /* console.log(evt, i); */
    if(evt.shiftKey){

    }
    this.bibliography.forEach(element=> {
      if(element.key == i.key){
        element.selected = !element.selected;
        element.selected ? this.selectedItem = element : this.selectedItem = null;
        return true;
      }else{
        element.selected = false;
        return false;
      }
    })
    
  }

  sortBibliography(evt?, val?){
    
    
    if(this.memorySort.field == val){
      if(this.direction == 'asc'){
        this.direction = 'desc'
        this.memorySort.direction = 'desc';
      }else{
        this.direction = 'asc';
        this.memorySort.direction = 'asc';
      }
    }else{
      this.sortField = val;
      this.direction = 'asc';
      this.memorySort = {field : this.sortField, direction : this.direction};
    }

    //@ts-ignore
    $("#biblioModal").modal("show");
    $('.modal-backdrop').appendTo('.table-body');
    //@ts-ignore
    $('#biblioModal').modal({backdrop: 'static', keyboard: false})  
    $('.modal-backdrop').appendTo('.table-body');
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");
    this.start = 0;
    this.tableBody.nativeElement.scrollTop = 0;

    this.biblioService.filterBibliography(this.start, this.sortField, this.direction, this.queryTitle, this.queryMode).subscribe(
      data=>{
        console.log(data)
        this.bibliography = [];
        //@ts-ignore
        $('#biblioModal').modal('hide');
        $('.modal-backdrop').remove();
        data.forEach(element => {
          this.bibliography.push(element)
        });
      },error=>{
        console.log(error)
      }
    )
    
  }

  addNewForm(){
    this.searchIconSpinner = true;
    /* console.log(this.object) */
    this.object['request'] = 'form'
   
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

  addNewSense(){
    this.searchIconSpinner = true;
    this.object['request'] = 'sense'
   
    let parentNodeInstanceName = this.object.parentNodeInstanceName;
    this.object['lexicalEntryInstanceName'] = parentNodeInstanceName
    this.object['request'] = 'sense'
    console.log(this.object);
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

  addBibliographyItem(item?){
    //@ts-ignore
    $("#biblioModal").modal("show");
    $('.modal-backdrop').appendTo('.ui-modal');
    //@ts-ignore
    $('#biblioModal').modal({backdrop: 'static', keyboard: false})  
    
    $('.modal-backdrop').css('height', 'inherit');
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");

    let instance = this.object.etymology.etymologyInstanceName;
    console.log(this.object)

    if(item != undefined){

      let id = item.data.key != undefined ? item.data.key : '';
      let title = item.data.title != undefined ? item.data.title : '';
      let author;
      
      item.data.creators.forEach(element => {
        if(element.creatorType == 'author'){
          author = element.lastName + ' ' + element.firstName;
          return true;
        }else{
          return false;
        }
      });
      author = author != undefined ? author : ''
      let date = item.data.date != undefined ? item.data.date : '';
      let url = item.data.url != undefined ? item.data.url : ''
      let seeAlsoLink = '';

      let parameters = {
        id : id,
        title: title,
        author: author,
        date: date,
        url: url,
        seeAlsoLink: seeAlsoLink
      }
      console.log(instance, parameters)
      this.lexicalService.addBibliographyData(instance, parameters).subscribe(
        data=>{
          //console.log(data);
          setTimeout(() => {
            //@ts-ignore
            $('#biblioModal').modal('hide');
            $('.modal-backdrop').remove();
          }, 300);
          this.biblioService.sendDataToBibliographyPanel(data);
        },error=>{
          console.log(error)
          
          setTimeout(() => {
            //@ts-ignore
            $('#biblioModal').modal('hide');
            $('.modal-backdrop').remove();
          }, 300);
          
        }
      )
    }
    
  }

  onCloseModal(){
    this.selectedItem = null;
    this.start = 0;
    this.sortField = 'title';
    this.direction = 'asc';
    this.tableBody.nativeElement.scrollTop = 0;
    this.memorySort = { field: this.sortField, direction: this.direction}
    this.biblioService.bootstrapData(this.start, this.sortField, this.direction).subscribe(
      data=> {
        this.bibliography = data;
        this.bibliography.forEach(element => {
          element['selected'] = false;
        }) 
                
       
      },error=>{
        console.log(error)
      }
    );
  }
}
