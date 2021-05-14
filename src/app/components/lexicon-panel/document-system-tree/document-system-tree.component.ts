import { Component, OnInit, ViewChild } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-document-system-tree',
  templateUrl: './document-system-tree.component.html',
  styleUrls: ['./document-system-tree.component.scss'],
})

export class DocumentSystemTreeComponent implements OnInit {

  switcher= false;
  @ViewChild('lexTree') lexTree: any;
  
  constructor(private lexicalService: LexicalEntriesService) { }

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

  newLexicalEntry(){
    this.lexicalService.newLexicalEntry().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error)
      }
    )
  }
}
