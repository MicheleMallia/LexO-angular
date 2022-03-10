import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AnnotatorService } from 'src/app/services/annotator/annotator.service';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-attestation-panel',
  templateUrl: './attestation-panel.component.html',
  styleUrls: ['./attestation-panel.component.scss']
})
export class AttestationPanelComponent implements OnInit,OnChanges {

  @Input() attestationData: any;
  constructor(private annotatorService : AnnotatorService, private lexicalService : LexicalEntriesService) { }

  formData = [];
  ngOnInit(): void {
  }
  

  ngOnChanges(changes: SimpleChanges) { 
    
    console.log(changes)
    if(changes.attestationData.currentValue != null){
      
      setTimeout(() => {
        console.log(changes.attestationData.currentValue)
        if(changes.attestationData.currentValue.length == 1 && changes.attestationData.currentValue[0] != this.formData[0]){
          changes.attestationData.currentValue.forEach(element => {
            this.formData.push(element)
          });
        }else if(changes.attestationData.currentValue.length > 1){
          this.formData = changes.attestationData.currentValue;
        }else if(changes.attestationData.currentValue.length == 0){
          this.formData = [];
          this.lexicalService.triggerAttestationPanel(false);
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

}
