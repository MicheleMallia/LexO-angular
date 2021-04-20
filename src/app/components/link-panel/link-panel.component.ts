import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-link-panel',
  templateUrl: './link-panel.component.html',
  styleUrls: ['./link-panel.component.scss']
})
export class LinkPanelComponent implements OnInit {

  @Input() linkData: any[] | any;
  
  counterElement = 0;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.linkData.currentValue != null){
      this.counterElement = this.linkData.elements.length;
    }else{
      this.counterElement = 0;
    }
  }

}
