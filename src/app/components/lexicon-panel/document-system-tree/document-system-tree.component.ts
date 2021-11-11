import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { ToastrService } from 'ngx-toastr';
import { DocumentSystemService } from 'src/app/services/document-system/document-system.service';
import { TreeNode } from '@circlon/angular-tree-component';

@Component({
  selector: 'app-document-system-tree',
  templateUrl: './document-system-tree.component.html',
  styleUrls: ['./document-system-tree.component.scss'],
})

export class DocumentSystemTreeComponent implements OnInit {

  switcher = false;
  @ViewChild('lexTree') lexTree: any;
  @ViewChild('textTree') textTree: any;

  constructor(private lexicalService: LexicalEntriesService, private toastr: ToastrService, private renderer: Renderer2, private documentService: DocumentSystemService) { }

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
      }else if(data['etymologyInstanceName'] != undefined){
        instanceName = data['etymologyInstanceName']
      };
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                
                x.data.note = data['new_note']
                that.lexTree.lexicalEntryTree.treeModel.update();
                that.lexTree.updateTreeView();

                //console.log(x)
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
            else if (data['etymologyInstanceName'] != undefined) {
              
              if(x.data.etymologyInstanceName == instanceName){
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
      //console.log("cambio label cambio tutto")
      //console.log(data)
      let instanceName = '';
      if(data['lexicalEntryInstanceName'] != undefined){
        instanceName = data['lexicalEntryInstanceName']
      }else if(data['formInstanceName'] != undefined){
        instanceName = data['formInstanceName']
      }else if(data['senseInstanceName'] != undefined){
        instanceName = data['senseInstanceName']
      }else if(data['etymologyInstanceName'] != undefined){
        instanceName = data['etymologyInstanceName']
      };;
      setTimeout(() => {
        this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
          function (x) {
            if (data['lexicalEntryInstanceName'] != undefined) {
              if(x.data.lexicalEntryInstanceName == instanceName){
                x.data.label = data['new_label']
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_label'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.label = data['new_label']
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_label'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.label = data['new_label']
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_label'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['etymologyInstanceName'] != undefined) {
              
              if(x.data.etymologyInstanceName == instanceName){
                x.data.label = data['new_label']
                //x.setActiveAndVisible()
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
      //console.log("cambio type cambio tutto")
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
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_type'] = undefined
                return true;
                
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.type = data['new_type']
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_type'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.type = data['new_type']
                //x.setActiveAndVisible()
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
      //console.log("cambio lang cambio tutto")
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
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_lang'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.language = data['new_lang']
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_lang'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.language = data['new_lang']
                //x.setActiveAndVisible()
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
      //console.log("cambio pos cambio tutto")
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
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_pos'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['formInstanceName'] != undefined) {
              
              if(x.data.formInstanceName == instanceName){
                x.data.pos = data['new_pos']
                //x.setActiveAndVisible()
                x.scrollIntoView();
                data['new_pos'] = undefined
                return true;
              }else{
                return false;
              }
            } else if (data['senseInstanceName'] != undefined) {
              
              if(x.data.senseInstanceName == instanceName){
                x.data.pos = data['new_pos']
                //x.setActiveAndVisible()
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

  

  changeFormType(data){
    var that = this;
    //console.log("prova")
    setTimeout(() => {
      this.lexTree.lexicalEntryTree.treeModel.getNodeBy(
        function (x) {
          if(x.data.formInstanceName != undefined){
              if(x.data.formInstanceName == data['formInstanceName']){
                x.data.type = data['new_type'];
                //console.log(x.data.note)
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
    // 3 -> quando devo cambiare solo la label di una forma
    // 5 -> quando devo cambiare il tipo di una forma
    // 6 -> quando devo cambiare definizione a un senso
    if(data != null){
      setTimeout(() => {
        switch(data['request']){
          case 0 : this.lexEdit(data); break;
          case 3 : this.changeFormLabel(data); break;
          case 5 : this.changeFormType(data); break;
          case 6 : this.changeSenseDefinition(data); break;
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
        //console.log(error);
        this.toastr.error(error.error, 'Error', {
          timeOut: 5000,
        });
      }
    )
  }


  addNewFile(evt?){
    let element_id = 0;
    let file_name = evt.target.files[0].name;
    let parameters = {
      "requestUUID" : "string",
      "user-id" : 0,
      "element-id" : element_id,
      "file-name" : file_name
    }
    
    const expandedNodes = this.textTree.treeText.treeModel.expandedNodes;
    console.log(parameters)
    this.documentService.uploadFile(parameters).subscribe(
      data=>{
        console.log(data)
        this.textTree.nodes = data['documentSystem'][0]['children'];
        
        expandedNodes.forEach( (node: TreeNode) => {
          
          setTimeout(() => {
            this.textTree.treeText.treeModel.getNodeBy(x => {
              if(x.data['element-id'] === node.data['element-id']){
                x.setActiveAndVisible()
              }
            })              
          }, 300);
        })
        
      },error=>{
        console.log(error)
      }
    )
    console.log(evt);
  }

  addNewFolder(){
    
    let element_id = 0;
    let parameters = {
      "requestUUID" : "string",
      "user-id" : 0,
      "element-id" : element_id
    }
    
    const expandedNodes = this.textTree.treeText.treeModel.expandedNodes;
    
    this.documentService.addFolder(parameters).subscribe(
      data=>{
        console.log(data)
        this.textTree.nodes = data['documentSystem'][0]['children'];
        setTimeout(() => {
          this.textTree.treeText.treeModel.getNodeBy(x => {
            if(x.data['element-id'] === element_id){
              x.expand()
            }
          })              
        }, 300);
        expandedNodes.forEach( (node: TreeNode) => {
          
          
        })
        
      },error=>{
        //console.log(error)
      }
    )
    
  }
}
