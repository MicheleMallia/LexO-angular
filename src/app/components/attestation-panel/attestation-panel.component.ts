import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-attestation-panel',
  templateUrl: './attestation-panel.component.html',
  styleUrls: ['./attestation-panel.component.scss']
})
export class AttestationPanelComponent implements OnInit,OnChanges {

  @Input() attestationData: any;
  constructor() { }

  formData = [];
  ngOnInit(): void {
  }
  

  ngOnChanges(changes: SimpleChanges) { 
    
    
    if(changes.attestationData.currentValue != undefined){
      
      this.formData = changes.attestationData.currentValue;

    }else{
      this.formData = [];
    }
  }

  cancelAttestation(index){
    console.log(index)
  }

}
