import { Component, OnInit, ViewChild } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';

@Component({
  selector: 'app-document-system-tree',
  templateUrl: './document-system-tree.component.html',
  styleUrls: ['./document-system-tree.component.scss'],
})

export class DocumentSystemTreeComponent implements OnInit {

  switcher = false;
  @ViewChild('lexTree') lexTree: any;

  constructor(private lexicalService: LexicalEntriesService) { }

  ngOnInit(): void {
    this.lexicalService.refreshAfterEdit$.subscribe(
      data => {
        this.refreshAfterEdit(data);
      }
    )
  }

  updateTreeParent() {
    this.lexTree.updateTreeView();
  }

  switchLabel() {
    this.lexTree.labelView = !this.lexTree.labelView;
    this.lexTree.idView = !this.lexTree.idView;
    this.switcher = !this.switcher;
  }

  refreshAfterEdit(data) {
    
    if(data != null){
      setTimeout(() => {
        let newLexEntryLabel = data['label'];
        let parameters = this.lexTree.getParameters();
        parameters['text'] = newLexEntryLabel + "~0.5";
        this.lexTree.lexicalEntriesFilter(parameters);
        this.lexTree.lexicalEntryTree.treeModel.update();
        this.lexTree.updateTreeView();
        
        setTimeout(() => {
          this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
            function (x) {
              console.log(x)
              if (x.data.label == newLexEntryLabel) {
                x.setActiveAndVisible()
                return true;
              } else {
                return false;
              }
            }
          );
        }, 500);
      }, 100);
    }
    

  }

  newLexicalEntry() {

    this.lexicalService.newLexicalEntry().subscribe(
      data => {
        console.log(data);
        setTimeout(() => {
          let newLexEntryLabel = data['label'];
          let parameters = this.lexTree.getParameters();
          parameters['text'] = newLexEntryLabel + "~0.5";
          this.lexTree.lexicalEntriesFilter(parameters);
          this.lexTree.lexicalEntryTree.treeModel.update();
          this.lexTree.updateTreeView();

          setTimeout(() => {
            this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
              function (x) {
                if (x.data.lexicalEntryInstanceName == data['lexicalEntryInstanceName']) {
                  x.setActiveAndVisible()
                  return true;
                } else {
                  return false;
                }
              }
            );
          }, 500);
        }, 200);
      },
      error => {
        console.log(error)
      }
    )
  }
}
