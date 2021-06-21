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

  lexEdit(data){
    let newLexEntryLabel = data['label'];
    let parameters = this.lexTree.getParameters();
    parameters['text'] = newLexEntryLabel + "~0.5";
    parameters['offset'] = 0
    console.log(parameters)
    this.lexTree.lexicalEntriesFilterAfterEdit(parameters);
    this.lexTree.lexicalEntryTree.treeModel.update();
    this.lexTree.updateTreeView();
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if (x.data.label == newLexEntryLabel) {
            x.setActiveAndVisible()
            x.scrollIntoView();
            return true;
          } else {
            return false;
          }
        }
      );
    }, 500);
  }

  childRequest(data){
    let parentNode = data['parentNode'];
    let parameters = this.lexTree.getParameters();
    parameters['text'] = parentNode + "~0.5";
    parameters['offset'] = 0
    this.lexTree.lexicalEntriesFilterAfterEdit(parameters);
    this.lexTree.lexicalEntryTree.treeModel.update();
    this.lexTree.updateTreeView();
    var that = this;
    console.log(data)
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if (x.data.label == parentNode) {
            that.lexTree.getChildren(x);
            
            /* x.setActiveAndVisible() */
            setTimeout(() => {
              x.expand();
              setTimeout(() => {
                that.lexTree.lexicalEntryTree.treeModel.getNodeBy(
                  function(y) {
                    if(y.data.label == data['whatToSearch']){
                      /* y.setActiveAndVisible() */
                      that.lexTree.getChildren(y);
                      
                      setTimeout(() => {
                        y.expand();


                        setTimeout(() => {
                          
                          that.lexTree.lexicalEntryTree.treeModel.getNodeBy(
                            function(z){
                              if(z.data.label == data['instanceName']){
                                z.setActiveAndVisible()
                                return true;
                              }else{
                                return false;
                              }
                            }
                          );
                        }, 1500);
                      }, 1000);
                    }
                  }
                )
              }, 1000);
            }, 500);
            return true;
          } else {
            return false;
          }
        }
      );
    }, 500);
  }

  pushNewForm(data){
    var that = this;
    console.log(data)
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.label == data['whatToSearch']){
            data['label'] = data['formInstanceName']
            x.data.children.push(data);
            setTimeout(() => {
              that.lexTree.lexicalEntryTree.treeModel.update();

              that.lexTree.lexicalEntryTree.treeModel.getNodeBy(
                function (y) {
                  if(y.data.label == data['label']){
                    y.setActiveAndVisible();
                  }
                }
              )
            }, 10);
            
            
          }
        }
      );
    }, 500);
  }

  changeFormLabel(data){
    var that = this;
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.formInstanceName != undefined){
              if(x.data.formInstanceName == data['formInstanceName']){
                x.data.label = data['new_label'];
                that.lexTree.lexicalEntryTree.treeModel.update();
                that.lexTree.updateTreeView();
                return true;
              }else{
                return false;
              }
            
          }else{
            return false;
          }
        }
      );
    }, 500);
  }

  refreshAfterEdit(data) {
    //TODO: inserire valori numerici per richieste specifiche, numeri interi, utilizzare lo switch e separare codice in apposite funzioni separate
    // 0 -> lexEdit: quando creo una nuova lexical entry
    // 1 -> childRequest: quando creo una nuova forma e c'è una lexical entry attiva
    // 2 -> !childRequest && !changeLabel: quando creo una forma e devo solo pushare il nodo senza refreshare l'albero
    // 3 -> quando devo cambiare solo la label di una forma
    if(data != null){
      setTimeout(() => {
        switch(data['request']){
          case 0 : this.lexEdit(data); break;
          case 1 : this.childRequest(data); break;
          case 2 : this.pushNewForm(data); break;
          case 3 : this.changeFormLabel(data); break;
        }
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
