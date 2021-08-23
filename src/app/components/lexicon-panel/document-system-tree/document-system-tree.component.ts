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

    var that = this;
    
    if(data['new_note'] != undefined){

      let instanceName = '';
      if(data['lexicalEntryInstanceName'] != undefined){
        instanceName = data['lexicalEntryInstanceName']
      }else if(data['formInstanceName'] != undefined){
        instanceName = data['formInstanceName']
      }else if(data['senseInstanceName'] != undefined){
        instanceName = data['senseInstanceName']
      };
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                
                x.data.note = data['new_note']
                that.lexTree.lexicalEntryTree.treeModel.update();
                that.lexTree.updateTreeView();

                console.log(x)
                //@ts-ignore
                $('.note_'+x.data.id).attr('data-original-title', data['new_note']);

                data['new_note'] = undefined;
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.note = data['new_note']
                that.lexTree.lexicalEntryTree.treeModel.update();
                that.lexTree.updateTreeView();
                data['new_note'] = undefined;
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.note = data['new_note']
                that.lexTree.lexicalEntryTree.treeModel.update();
                that.lexTree.updateTreeView();
                data['new_note'] = undefined;
                return true;
              }else{
                return false;
              }
            }
            else {
              return false;
            } 
          }
        );
      }, 500); 
    }else if(data['new_label'] != undefined){
      console.log("cambio label cambio tutto")
      console.log(data)
      let instanceName = '';
      if(data['lexicalEntryInstanceName'] != undefined){
        instanceName = data['lexicalEntryInstanceName']
      }else if(data['formInstanceName'] != undefined){
        instanceName = data['formInstanceName']
      }else if(data['senseInstanceName'] != undefined){
        instanceName = data['senseInstanceName']
      };
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                x.data.label = data['new_label']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_label'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.label = data['new_label']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_label'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.label = data['new_label']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_label'] = undefined
                return true;
              }else{
                return false;
              }
            }
            else {
              return false;
            } 
          }
        );
      }, 500); 
    }else if(data['new_type'] != undefined){
      console.log("cambio type cambio tutto")
      let instanceName = '';
      if(data['lexicalEntryInstanceName'] != undefined){
        instanceName = data['lexicalEntryInstanceName']
      }else if(data['formInstanceName'] != undefined){
        instanceName = data['formInstanceName']
      }else if(data['senseInstanceName'] != undefined){
        instanceName = data['senseInstanceName']
      };
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                x.data.type = data['new_type']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_type'] = undefined
                return true;
                
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.type = data['new_type']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_type'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.type = data['new_type']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_type'] = undefined
                return true;
              }else{
                return false;
              }
            }
            else {
              return false;
            } 
          }
        );
      }, 500); 
    }else if(data['new_lang'] != undefined){
      console.log("cambio lang cambio tutto")
      let instanceName = '';
      if(data['lexicalEntryInstanceName'] != undefined){
        instanceName = data['lexicalEntryInstanceName']
      }else if(data['formInstanceName'] != undefined){
        instanceName = data['formInstanceName']
      }else if(data['senseInstanceName'] != undefined){
        instanceName = data['senseInstanceName']
      };
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                x.data.language = data['new_lang']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_lang'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.language = data['new_lang']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_lang'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.language = data['new_lang']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_lang'] = undefined
                return true;
              }else{
                return false;
              }
            }
            else {
              return false;
            } 
          }
        );
      }, 500); 
    }else if(data['new_pos'] != undefined){
      console.log("cambio pos cambio tutto")
      let instanceName = '';
      if(data['lexicalEntryInstanceName'] != undefined){
        instanceName = data['lexicalEntryInstanceName']
      }else if(data['formInstanceName'] != undefined){
        instanceName = data['formInstanceName']
      }else if(data['senseInstanceName'] != undefined){
        instanceName = data['senseInstanceName']
      };
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                x.data.pos = data['new_pos']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_pos'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.pos = data['new_pos']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_pos'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.pos = data['new_pos']
                x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_pos'] = undefined
                return true;
              }else{
                return false;
              }
            }
            else {
              return false;
            } 
          }
        );
      }, 500); 
    }
    
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
            setTimeout(() => {
              x.expand();
              setTimeout(() => {
                that.lexTree.lexicalEntryTree.treeModel.getNodeBy(
                  function(y) {
                    if(y.data.label == data['whatToSearch']){
                      that.lexTree.getChildren(y);
                      setTimeout(() => {
                        y.expand();
                        setTimeout(() => {
                          that.lexTree.lexicalEntryTree.treeModel.getNodeBy(
                            function(z){
                              if(data.sense != undefined){
                                if(z.data.senseInstanceName == data['instanceName']){
                                  z.setActiveAndVisible();
                                  return true;
                                }else{
                                  return false;
                                }
                              }else if(z.data.label == data['instanceName']){
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
          if(x.data.lexicalEntryInstanceName == data['parentNodeInstanceName'] && x.data.label == data['parentNode'] && x.data.form == undefined){
            x.data.children.forEach(element => {
              if(element.label == 'form'){
                data['label'] = data['formInstanceName']
                element.count++;
                element.children.push(data);
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
            });
          }
        }
      );
    }, 500);
  }

  pushNewSense(data){
    var that = this;
    console.log(data)
    setTimeout(() => {

      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          
          if(x.data.lexicalEntryInstanceName == data['parentNodeInstanceName'] && x.data.sense == undefined){
            console.log(x)
            x.data.children.forEach(element => {
              if(element.label == 'sense'){
                data['definition'] = "";
                data['hasChildren'] = false;
                data['label'] = "no definition";
                element.count++;
                element.children.push(data);
                setTimeout(() => {
                  that.lexTree.lexicalEntryTree.treeModel.update();
                  that.lexTree.lexicalEntryTree.treeModel.getNodeBy(
                    function (y) {
                      if(y.data.senseInstanceName == data['senseInstanceName']){
                        y.setActiveAndVisible();
                      }
                    }
                  )
                }, 10);
              }
            });
          }
        }
      );
    }, 500);
  }

  changeSenseDefinition(data){
    var that = this;
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.senseInstanceName != undefined){
              if(x.data.senseInstanceName == data['senseInstanceName']){
                x.data.label = data['new_definition'];
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

  /* changeFormNote(data){
    var that = this;
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.formInstanceName != undefined){
              if(x.data.formInstanceName == data['formInstanceName']){
                x.data.note = data['new_note'];
                console.log(x.data.note)
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
  } */

  /* changeSenseNote(data){
    var that = this;
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.senseInstanceName != undefined){
              if(x.data.senseInstanceName == data['senseInstanceName']){
                x.data.note = data['new_note'];
                console.log(x.data.note)
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
  } */

  changeFormType(data){
    var that = this;
    console.log("prova")
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.formInstanceName != undefined){
              if(x.data.formInstanceName == data['formInstanceName']){
                x.data.type = data['new_type'];
                console.log(x.data.note)
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
    // 4 -> quando devo cambiare la nota di una label
    // 5 -> quando devo cambiare il tipo di una forma
    // 6 -> quando devo cambiare definizione a un senso
    // 7 -> quando devo pushare un nuovo senso
    // 8 -> quando cambio nota a un senso
    if(data != null){
      setTimeout(() => {
        switch(data['request']){
          case 0 : this.lexEdit(data); break;
          case 1 : this.childRequest(data); break;
          case 2 : this.pushNewForm(data); break;
          case 3 : this.changeFormLabel(data); break;
          /* case 4 : this.changeFormNote(data); break; */
          case 5 : this.changeFormType(data); break;
          case 6 : this.changeSenseDefinition(data); break;
          case 7 : this.pushNewSense(data); break;
          /* case 8 : this.changeSenseNote(data); data; */
        }
      }, 100);
    }
    

  }

  triggerLoad(){
    this.lexicalService.refreshLangTable();
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
