import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-link-panel',
  templateUrl: './link-panel.component.html',
  styleUrls: ['./link-panel.component.scss']
})
export class LinkPanelComponent implements OnInit {

  @Input() linkData: any[] | any;
  
  seeAlsoData : {};
  sameAsData : {};
  counterElement = 0;
  object : any;
  constructor(private lexicalService: LexicalEntriesService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.linkData.currentValue != null){
      
      this.object = changes.linkData.currentValue;
      this.sameAsData = this.object;
      this.seeAlsoData = this.object;
      console.log(changes.linkData.currentValue)

      //TODO: richiamare il servizio per il recupero dei dati relativi a sameAs e seeAlso
      if(this.object.lexicalEntryInstanceName != undefined){
        let lexId = this.object.lexicalEntryInstanceName;
        this.lexicalService.getLexEntryLinguisticRelation(lexId, 'sameAs').subscribe(
          data=>{
            console.log(data)
          }, error=>{
            console.log(error);
            
          }
        )

        this.lexicalService.getLexEntryLinguisticRelation(lexId, 'seeAlso').subscribe(
          data=>{
            console.log(data)
          }, error=>{
            console.log(error);
            
          }
        )
      }
      
    }else{
      this.counterElement = 0;
    }
  }

}
