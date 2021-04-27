import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-link-panel',
  templateUrl: './link-panel.component.html',
  styleUrls: ['./link-panel.component.scss']
})
export class LinkPanelComponent implements OnInit {

  @Input() linkData: any[] | any;
  
  seeAlsoData : any;
  sameAsData : any;
  counterElement = 0;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.linkData.currentValue != null){
      this.seeAlsoData = this.linkData.elements[0];
      this.sameAsData = this.linkData.elements[1];
      /* console.log(this.seeAlsoData) */
      this.counterElement = this.linkData.elements.length;
    }else{
      this.counterElement = 0;
    }
  }

}
