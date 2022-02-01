import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-attestation-panel',
  templateUrl: './attestation-panel.component.html',
  styleUrls: ['./attestation-panel.component.scss']
})
export class AttestationPanelComponent implements OnInit,OnChanges {

  @Input() attestationData: any;
  constructor() { }

  formData = {}
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) { 
    
    
    console.log(changes.attestationData.currentValue[0])
    this.formData = changes.attestationData.currentValue;
  
}

}
