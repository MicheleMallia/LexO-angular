﻿/*
  © Copyright 2021-2022  Istituto di Linguistica Computazionale "A. Zampolli", Consiglio Nazionale delle Ricerche, Pisa, Italy.
 
This file is part of EpiLexo.

EpiLexo is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

EpiLexo is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with EpiLexo. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AnnotatorService } from 'src/app/services/annotator/annotator.service';
import { ExpanderService } from 'src/app/services/expander/expander.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  private search_subject: Subject<any> = new Subject();
  searchResults: any[];

  constructor(private annotatorService: AnnotatorService, private lexicalService : LexicalEntriesService, private expander : ExpanderService, private renderer : Renderer2) { }

  @Input() bind;
  @ViewChild('select_form') select_form: NgSelectComponent;
  loader = false;

  ngOnInit(): void {
    setTimeout(() => {
      //console.log(this.select_form);
    }, 1000);

    this.search_subject.pipe(debounceTime(1000)).subscribe(
      data => {
          this.onSearchFilter(data)
      }
    )

    this.annotatorService.triggerSearch$.subscribe(
      request => {
        console.log(request);
        if(request != null){
          this.bindSelection(request);
        } 
      },error => {

      } 
    ).unsubscribe();
  }


  triggerSearch(evt) {
    if (evt.target != undefined) {
        
        this.search_subject.next(evt.target.value)
    }
  }

  onSearchFilter(data) {
    this.searchResults = [];
    /* console.log(data) */
    let parameters = {
        text: data,
        searchMode: "startsWith",
        representationType: "writtenRep",
        author: "",
        offset: 0,
        limit: 500
    }
    console.log(parameters)
    if (data != "") { /* && data.length >= 3 */
      
      this.lexicalService.getFormList(parameters).subscribe(
          data => {
              console.log(data)
              this.searchResults = data['list'];
              this.loader = false;
          }, error => {
              //console.log(error)
          }
      )
    } 
    
  }

  clearAll(){
    this.select_form.handleClearClick();
  }

  bindSelection(req){
    this.loader = true;
    setTimeout(() => {
      this.select_form.filter(req);
      this.onSearchFilter(req)
    }, 100);
    
  }

  /* ngOnDestroy(){
    this.lexicalService.
  } */

  handleForm(evt) {

    if (evt instanceof NgSelectComponent) {
        if (evt.selectedItems.length > 0) {
            /* console.log(evt.selectedItems[0]) */
            let label;
            if(evt.selectedItems[0]['value']['formInstanceName'] != undefined){
              label = evt.selectedItems[0]['value']['formInstanceName'];
            }else{
              label = evt.selectedItems[0].label;
            }
            this.onChangeForm(evt.selectedItems[0]['value'])
        }
    } /* else {
        let label = evt.target.value;
        this.form_subject.next({ name: label})
    } */
  }


  onChangeForm(data) {
    /* var index = data['i']; */
   
    //this.cognatesArray = this.coreForm.get("cognate") as FormArray;
    
    /* if (this.memoryForms == undefined) {
        const newValue = data['name']
        parameters = {
            type: "lexicalRel",
            relation: "cognate",
            value: newValue
        }
        


    } else {
        const oldValue = this.memoryForms[0]['lexicalEntity']
        const newValue = data['name']
        parameters = {
            type: "lexicalRel",
            relation: "cognate",
            value: newValue,
            currentValue: oldValue
        }
        this.memoryForms[0] = data;
    } */

    /* console.log(data) */
    /* this.lexicalService.triggerAttestationPanel(true);
    this.lexicalService.sendToAttestationPanel(data); */

   
    let parameters = {}
    let idPopover = this.bind.selectedPopover.tokenId;
    let tokenData = this.bind.object[idPopover];
    let textSelection = this.bind.message;
    let selectionSpan = this.bind.spanSelection;
    let formValue = data.form;

    if(textSelection != ''){
      parameters["value"] = formValue;
      parameters["layer"] = "attestation";
      parameters["attributes"] = {
        author : "",
        creator : "",
        note: "",
        confidence : 1,
        timestamp : new Date().getTime().toString(),
        bibliography: [],
        validity : "",
        externalRef : "",
        node_id : tokenData.id,
        label : data.label,
        form_id : data.formInstanceName
      };
      parameters["spans"] = [
        {
          start : selectionSpan.start.toString(),
          end : selectionSpan.end.toString()
        }
      ];
      parameters["id"] = tokenData.node;
    }else{
      parameters["value"] = formValue;
      parameters["layer"] = "attestation";
      parameters["attributes"] = {
        author : "",
        creator : "prova",
        note: "",
        confidence : 1,
        timestamp : new Date().getTime().toString(),
        bibliography: [],
        validity : "",
        externalRef : "",
        node_id : tokenData.id,
        label : data.label,
        form_id : data.formInstanceName
      };
      parameters["spans"] = [
        {
          start : tokenData.begin.toString(),
          end : tokenData.end.toString()
        }
      ];
      parameters["id"] = tokenData.node;
    }
    console.log(idPopover, tokenData, data);

    console.log(parameters)

    this.annotatorService.addAnnotation(parameters, tokenData.node).subscribe(
      data=> {
        console.log(data);
        this.bind.annotationArray.push(data);
        this.bind.populateLocalAnnotation(data)
        
        /* this.lexicalService.sendToAttestationPanel(data); */
      },
      error => {
        console.log(error);
      }
    )


    /* //TODO INSERIRE MODO PER CREARE SPAN ANNOTATION SE C'È UN ELEMENTO MARK
    let markElement = Array.from(document.getElementsByClassName('mark'))[0];
    let parentMarkElement = document.getElementsByClassName('token-'+this.bind.selectedPopover.tokenId)[0];
    if(markElement != null){
      this.renderer.removeClass(markElement, 'mark');
      this.renderer.addClass(markElement, 'annotation');
      //this.renderer.addClass(markElement, 'unselectable')
    }else{
      //QUI SE NON C'È ALCUN MARK SPAN E VIENE SELEZIONATA LA PAROLA INTERA
      this.renderer.addClass(parentMarkElement, 'annotation_entire');
      //this.renderer.addClass(parentMarkElement, 'unselectable');
    } */

    
    /* if(parentMarkElement != null){
      Array.from(parentMarkElement.children).forEach(
        element => {
          console.log(element.classList)
          if(element.classList.contains('mark_test')){

            this.renderer.removeClass(element, 'mark_test');
            this.renderer.addClass(element, 'annotation_ultra');
            this.renderer.addClass(element, 'unselectable')
            return;
          }
        }
      );
      
    } */
    

    //let lexId = this.object.lexicalEntryInstanceName;
    /* this.lexicalService.updateLinguisticRelation(lexId, parameters).subscribe(
        data => {
            console.log(data);
            this.lexicalService.spinnerAction('off');
            data['request'] = 0;
            this.lexicalService.refreshAfterEdit(data);
            this.lexicalService.updateLexCard(data)
        }, error => {
            console.log(error)

            this.lexicalService.updateLexCard({ lastUpdate: error.error.text })
            this.lexicalService.spinnerAction('off');
            if(error.status == 200){
                this.toastr.success('Cognates changed correctly for ' + lexId, '', {
                    timeOut: 5000,
                });
            }else{
                this.toastr.error(error.error, 'Error', {
                    timeOut: 5000,
                  });
                
            }
        }
    ) */
  }

  addNewForm = (form:string) => {
    let text = form;
    
  }

}
