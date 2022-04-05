/*
  © Copyright 2021-2022  Istituto di Linguistica Computazionale "A. Zampolli", Consiglio Nazionale delle Ricerche, Pisa, Italy.
 
This file is part of EpiLexo.

EpiLexo is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

EpiLexo is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with EpiLexo. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AnnotatorService } from 'src/app/services/annotator/annotator.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-attestation-panel',
  templateUrl: './attestation-panel.component.html',
  styleUrls: ['./attestation-panel.component.scss']
})
export class AttestationPanelComponent implements OnInit,OnChanges {

  @Input() attestationData: any;
  private update_anno_subject: Subject<any> = new Subject();
  constructor(private annotatorService : AnnotatorService, private lexicalService : LexicalEntriesService) { }

  formData = [];
  ngOnInit(): void {

    this.update_anno_subject.pipe(debounceTime(1000)).subscribe(
      data => {
        if(data != null){
          this.updateAnnotation(data)
        }
      }
    )
  }
  

  ngOnChanges(changes: SimpleChanges) { 
    
    console.log(changes)
    if(changes.attestationData.currentValue != null){
      setTimeout(() => {

        if(changes.attestationData.currentValue != this.formData){
          this.formData = [];
        }
        this.formData = changes.attestationData.currentValue;

        if(this.formData.length == 0){
          this.lexicalService.triggerAttestationPanel(false)
        }
        
      }, 10);
      
    }
  }

  cancelAttestation(index, id){
    this.formData.splice(index,1);
    this.annotatorService.deleteAnnotationRequest(id);
    this.annotatorService.deleteAnnotation(id).subscribe(
      data=> {
        console.log(data)
      },error => {
        console.log(error)
      }
    );
    if(this.formData.length == 0){
      this.lexicalService.triggerAttestationPanel(false)
    }
  }

  triggerUpdateAttestation(evt, newValue, propKey, annotation){
    this.update_anno_subject.next({event : evt, newValue : newValue, propKey: propKey, annotation : annotation})
  }

  updateAnnotation(data){
    if(data !=null){
      let id_annotation = data?.annotation?.id;
      let newValue = data?.newValue;
      let property = data?.propKey;

      let annotation = data?.annotation; 

      annotation.attributes[property] = newValue;

      this.annotatorService.updateAnnotation(annotation).subscribe(
        data=> {
          console.log(data)
        },error =>{
          console.log(error)
        }
      )

    } 
  }

}
