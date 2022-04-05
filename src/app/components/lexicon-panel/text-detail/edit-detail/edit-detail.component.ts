﻿/*
  © Copyright 2021-2022  Istituto di Linguistica Computazionale "A. Zampolli", Consiglio Nazionale delle Ricerche, Pisa, Italy.
 
This file is part of EpiLexo.

EpiLexo is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

EpiLexo is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with EpiLexo. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExpanderService } from 'src/app/services/expander/expander.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.component.html',
  styleUrls: ['./edit-detail.component.scss']
})
export class EditDetailComponent implements OnInit {

  object : any;
  showTrigger = false;
  @ViewChild('navtabs') navtabs: ElementRef; 
  @ViewChild('navcontent') navcontent: ElementRef; 

  constructor(private lexicalService: LexicalEntriesService, private exp : ExpanderService) { }

  ngOnInit(): void {
    
    this.object = null;
    this.lexicalService.coreData$.subscribe(
      object => {
        if(object != null){
          if(object['lexicalEntryInstanceName'] != undefined ||
             object['formInstanceName'] != undefined ||
             object['senseInstanceName'] != undefined){
            var navTabLinks = this.navtabs.nativeElement.querySelectorAll('a')
            this.object = object;
            navTabLinks.forEach(element => {
              /* //console.log(element) */
              if(element.text == 'Core'){
                element.classList.add('active')
              }else{
                element.classList.remove('active')
                //console.log(element.id)
              }
            });

            

            var navContent = this.navcontent.nativeElement.querySelectorAll('.tab-pane');
            
            navContent.forEach(element => {
              
              if(element.id == 'core'){
                element.classList.add('active')
                element.classList.add('show')
                console.log("picchio");
                console.log(element)
              }else{
                
                element.classList.remove('active')
                element.classList.remove('show')
                console.log("picchio21")
                console.log(element)
              }
            });

          }else {
            this.object = null;
          }
        }
      }
    );

    this.lexicalService.etymologyData$.subscribe(
      object => {
        if(object != null){
          if(object['etymology']['etymologyInstanceName'] != undefined){
            this.object = object;
            var navTabLinks = this.navtabs.nativeElement.querySelectorAll('a')
            
            navTabLinks.forEach(element => {
              //console.log(element.text)
              if(element.text == 'Etymology'){
                /* console.log("aggiungo active a:") */
                element.classList.add('active')

              }else{
                element.classList.remove('active')
                /* console.log("tolgo active a:") */
              }
            });
            var navContent = this.navcontent.nativeElement.querySelectorAll('.tab-pane');
            
            navContent.forEach(element => {
              //console.log(element.id)
              if(element.id == 'etymology'){
                element.classList.add('active')
                element.classList.add('show')
              }else{
                element.classList.remove('active')
                element.classList.remove('show')
                //console.log(element.id)
              }
            });
            
          }else {
            this.object = null;
          }
        }
      }
    );
  }

  triggerExpansionEdit(){
 
    setTimeout(() => {

      if(this.exp.isEditTabOpen() && !this.exp.isEpigraphyTabOpen()){
        if(this.exp.isEditTabExpanded() && !this.exp.isEpigraphyTabExpanded()){
          this.exp.openCollapseEdit();
          this.exp.expandCollapseEdit();
        }
      }else if(!this.exp.isEditTabOpen() && !this.exp.isEpigraphyTabOpen()){
        if(!this.exp.isEditTabExpanded() && !this.exp.isEpigraphyTabExpanded()){
          this.exp.openCollapseEdit();
          this.exp.expandCollapseEdit();
        }
      }else if(this.exp.isEditTabOpen() && this.exp.isEpigraphyTabOpen()){
        this.exp.openCollapseEdit();
        this.exp.expandCollapseEpigraphy(true);
      }else if(!this.exp.isEditTabOpen() && this.exp.isEpigraphyTabOpen()){
        if(!this.exp.isEditTabExpanded() && this.exp.isEpigraphyTabExpanded()){
          this.exp.expandCollapseEpigraphy(false);
          this.exp.openCollapseEdit(true)
        }
        
      }
      
    }, 200);
  }

}
