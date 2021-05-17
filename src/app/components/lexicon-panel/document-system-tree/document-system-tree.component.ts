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
    let parameters = this.lexTree.getParameters();
    this.lexicalService.newLexicalEntry().subscribe(
      data => {
        console.log(data);
        setTimeout(() => {
          this.lexTree.lexicalEntriesFilter(parameters);
          this.lexTree.lexicalEntryTree.treeModel.update();
          this.lexTree.updateTreeView();
        }, 200);
      },
      error => {
        console.log(error)
      }
    )
  }
}
