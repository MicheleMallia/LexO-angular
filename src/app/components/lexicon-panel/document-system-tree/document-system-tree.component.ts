import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-document-system-tree',
  templateUrl: './document-system-tree.component.html',
  styleUrls: ['./document-system-tree.component.scss'],
})

export class DocumentSystemTreeComponent implements OnInit {

  switcher= false;
  @ViewChild('lexTree') lexTree: any;
  
  constructor() { }

  ngOnInit(): void {
  }

  updateTreeParent(){
    this.lexTree.updateTreeView();
  }

  switchLabel(){
    this.lexTree.labelView = !this.lexTree.labelView;
    this.lexTree.idView = !this.lexTree.idView;
    this.switcher = !this.switcher;
  }
}
