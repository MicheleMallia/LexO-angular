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
      this.counterElement = 0;
      this.object = changes.linkData.currentValue;
      this.sameAsData = null;
      this.seeAlsoData = null;
      
      /* console.log(changes.linkData.currentValue) */

      //TODO: richiamare il servizio per il recupero dei dati relativi a sameAs e seeAlso
      if(this.object.lexicalEntryInstanceName != undefined){
        let lexId = this.object.lexicalEntryInstanceName;
        this.lexicalService.getLexEntryLinguisticRelation(lexId, 'sameAs').subscribe(
          data=>{
            console.log(data);
            this.sameAsData = {}
            this.sameAsData['array'] = data;
            this.sameAsData['parentNodeLabel']= this.object['lexicalEntry'];
            this.sameAsData['lexicalEntryInstanceName']= this.object['lexicalEntryInstanceName'];
          }, error=>{
            this.sameAsData = {}
            this.sameAsData['array'] = [];
            this.sameAsData['parentNodeLabel']= this.object['lexicalEntry'];
            this.sameAsData['lexicalEntryInstanceName']= this.object['lexicalEntryInstanceName'];
            console.log(error);
            
          }
        )

        this.lexicalService.getLexEntryLinguisticRelation(lexId, 'seeAlso').subscribe(
          data=>{
            this.seeAlsoData = {}
            this.seeAlsoData['array'] = data;
            this.seeAlsoData['parentNodeLabel']= this.object['lexicalEntry'];
            this.seeAlsoData['lexicalEntryInstanceName']= this.object['lexicalEntryInstanceName'];
          }, error=>{
            this.seeAlsoData = {}
            this.seeAlsoData['array'] = [];
            this.seeAlsoData['parentNodeLabel']= this.object['lexicalEntry'];
            this.seeAlsoData['lexicalEntryInstanceName']= this.object['lexicalEntryInstanceName'];
            console.log(error);
            
          }
        )
      }

      //TODO: inserire counter 
      console.log(this.object)
      this.object.links.forEach(element => {
        if(element.type != undefined){
          if(element.type == 'Reference'){
            element.elements.forEach(sub => {
              this.counterElement += sub.count;
            });
          }
        }
      });
      
    }else{
      this.counterElement = 0;
      this.sameAsData = null;
      this.seeAlsoData = null;
    }
  }

}
