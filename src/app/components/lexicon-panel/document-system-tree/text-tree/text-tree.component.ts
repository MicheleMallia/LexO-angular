import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from '@circlon/angular-tree-component';
import { ModalComponent } from 'ng-modal-lib';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { DocumentSystemService } from 'src/app/services/document-system/document-system.service';
import { v4 } from 'uuid';


const actionMapping: IActionMapping = {
  mouse: {
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
    },
    /* contextMenu: (tree, node, $event) => {
      //$event.preventDefault();
      //alert(`context menu for ${node.data.name}`);
      TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
    } */
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};



@Component({
  selector: 'app-text-tree',
  templateUrl: './text-tree.component.html',
  styleUrls: ['./text-tree.component.scss']
})

export class TextTreeComponent implements OnInit {

  @ViewChild('treeText') treeText: any;
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  
  show = false;
  nodes : any;

  renameNodeSelected : any;
  validName = null;

  selectedFileToCopy : any;

  memoryMetadata = [];
  metadataForm = new FormGroup({
    element_id : new FormControl(null),
    metadata_array: new FormArray([], [Validators.required]),
  })
  
  objectKeys = Object.keys;
  metadata_array: FormArray;

  options: ITreeOptions = {
    actionMapping,
    allowDrag: (node) => node.isLeaf,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`
    })
  };


  @ViewChild('renameFolderInput') renameFolder_input:ElementRef; 
  @ViewChild('renameFileInput') renameFile_input:ElementRef; 
  @ViewChild('uploadFile') uploadFile_input:ElementRef; 
  @ViewChild('renameFolderModel', {static: false}) renameFolderModal: ModalComponent;
  @ViewChild('editMetadata', {static: false}) editMetadataModal: ModalComponent;
  
  constructor(private documentService: DocumentSystemService, private renderer: Renderer2, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.loadTree();

    this.metadataForm = this.formBuilder.group({
      element_id : new FormControl(null),
      metadata_array: new FormArray([], [Validators.required]),
    })
  }

  ngAfterViewInit(){
    
  }
  
  onEvent = ($event: any) => {
    console.log($event);
  }

  onMoveNode($event) {
    console.log($event);
    let node_type = $event.node.type;
    let target_type = $event.to.parent.type;
    if(node_type === 'directory' && target_type === 'directory'){
      this.moveFolder($event)
    }else if(node_type === 'file' && target_type === 'directory'){
      this.moveFile($event)
    }
    
  }

  onKey = ($event:any) => {
    var that = this;
    setTimeout(function(){ 
      var results = document.body.querySelectorAll('tree-node-collection > div')[0].children.length;
      if(results == 0){
        that.show = true;
      } else {
        that.show = false;
      }
    }, 5);  
  };

  showMessage(message: any) {
    //console.log(message);
  }

  loadTree(){
    this.documentService.getDocumentSystem().subscribe(
      data => {
        /* //console.log(data) */
        this.nodes = data['documentSystem']
      },
      error => {
        //console.log(error)
      }
    )
  }

  isFolder(item : any){
    if(item.type != undefined){
      return item.type == 'directory';
    }else{
      return false
    }
  }

  isFile(item : any){
    if(item.type != undefined){
      return item.type == 'file';
    }else{
      return false
    }
  }

  noRoot(item : any){
    return item.name != 'root';
  }
  

  addFolder(evt){
    if(evt != undefined){
      let element_id = evt['element-id'];
      let parameters = {
        "requestUUID" : "string",
        "user-id" : 0,
        "element-id" : element_id
      }
      
      const expandedNodes = this.treeText.treeModel.expandedNodes;
      
      this.documentService.addFolder(parameters).subscribe(
        data=>{
          console.log(data)
          this.nodes = data['documentSystem'];
          console.log(expandedNodes)  
          expandedNodes.forEach( (node: TreeNode) => {

            setTimeout(() => {
              this.treeText.treeModel.getNodeBy(x => {
                if(x.data['element-id'] === node.data['element-id']){
                  x.expand()
                }
              })              
            }, 300);
          })
          
        },error=>{
          //console.log(error)
        }
      )
    }
  }

  addFile(evt){
    console.log(evt)
    let element_id = this.uploadFile_input.nativeElement['element-id'];
    let file_name = evt.target.files[0].name;
    this.renderer.removeAttribute(this.uploadFile_input.nativeElement, 'element-id');

    let parameters = {
      "requestUUID" : "string",
      "user-id" : 0,
      "element-id" : element_id,
      "file-name" : file_name
    }
    
    console.log(parameters)
    const expandedNodes = this.treeText.treeModel.expandedNodes;
    
    this.documentService.uploadFile(parameters).subscribe(
      data=>{
        console.log(data)
        this.nodes = data['documentSystem'];
        expandedNodes.forEach( (node: TreeNode) => {
          
          setTimeout(() => {
            this.treeText.treeModel.getNodeBy(x => {
              if(x.data['element-id'] === node.data['element-id']){
                x.expand()
              }
            })              
          }, 300);
        })
        
      },error=>{
        console.log(error)
      }
    )
    
  }

  triggerUploader(evt){
    let element_id = evt['element-id']
    this.renderer.setProperty(this.uploadFile_input.nativeElement, 'element-id', element_id)
    this.uploadFile_input.nativeElement.click();
    
  }

  copyFile(evt){
    console.log(evt);
    this.selectedFileToCopy = evt
  }

  pasteFile(evt){
    console.log(evt)
    let element_id_target = evt['element-id'];
    let element_id_source = this.selectedFileToCopy['element-id'];
    let parameters = {
      "requestUUID": "string",
      "user-id": 0,
      "element-id": element_id_source,
      "target-id": element_id_target
    }
            
    this.documentService.copyFileTo(parameters).subscribe(
      data=>{
        console.log(data);
        this.nodes = data['documentSystem'];
        setTimeout(() => {
          
          this.treeText.treeModel.getNodeBy(x => {
            if(x.data['element-id'] === element_id_target){
              x.expand();
            }
          })              
        }, 300);
        this.selectedFileToCopy = null;
      },error=>{
        //console.log(error)
        this.selectedFileToCopy = null;
      }
    )
    

  }

  downloadFile(evt){
    console.log(evt)
    let element_id = evt['element-id'];
    let parameters = {
      "requestUUID": "string",
      "user-id": 0,
      "element-id": element_id,
    }
            
    this.documentService.downloadFile(parameters).subscribe(
      data=>{
        console.log(data);
        
      },error=>{
        //console.log(error)
      }
    )
  }
  
  removeFile(evt){
    if(evt != undefined){
      let element_id = evt['element-id'];
      let parameters = {
        "requestUUID" : "string",
        "user-id" : 0,
        "element-id" : element_id,
      }


      const expandedNodes = this.treeText.treeModel.expandedNodes;

      this.documentService.removeFile(parameters).subscribe(
        data=>{
          //console.log(data);
          
          this.nodes = data['documentSystem'];
          expandedNodes.forEach( (node: TreeNode) => {
          
            setTimeout(() => {
              this.treeText.treeModel.getNodeBy(x => {
                if(x.data['element-id'] === node.data['element-id']){
                  x.expand()
                }
              })              
            }, 300);
          })
          
          
        },error=>{
          //console.log(error)
        }
      )
    }
  }
  

  renameFile(renameValue){
    console.log(renameValue)
    if (renameValue.match(/^[A-Za-z-_0-9.]{3,}$/)) {
      this.validName = true;
      //console.log(this.renameNodeSelected);
      let element_id = this.renameNodeSelected['element-id'];
      let parameters = {
        "requestUUID": "string",
        "user-id": 0,
        "element-id": element_id,
        "rename-string": renameValue
      }

      this.documentService.renameFile(parameters).subscribe(
        data=> {
          //console.log(data);
          /* this.loadTree() */
          setTimeout(() => {
            this.treeText.treeModel.getNodeBy(x => {
              if(x.data['element-id'] === element_id){
                x.data.name = renameValue;
              }
            })              
          }, 300);
          this.renameFolder_input.nativeElement.value = '';
          this.renameFolderModal.hide();
        },error=>{
          //console.log(error)
        }
      )
    }else{
      this.validName = false;
    }
    this.renameNodeSelected = null;
  
  }


  removeFolder(evt){
    if(evt != undefined){
      let element_id = evt['element-id'];
      let parameters = {
        "requestUUID" : "string",
        "user-id" : 0,
        "element-id" : element_id
      }

      const expandedNodes = this.treeText.treeModel.expandedNodes;

      this.documentService.removeFolder(parameters).subscribe(
        data=>{
          //console.log(data);
          
          this.nodes = data['documentSystem'];
          expandedNodes.forEach( (node: TreeNode) => {
          
            setTimeout(() => {
              this.treeText.treeModel.getNodeBy(x => {
                if(x.data['element-id'] === node.data['element-id']){
                  x.expand()
                }
              })              
            }, 300);
          })
          
          
        },error=>{
          //console.log(error)
        }
      )
    }
  }

  moveFolder(evt){
    if(evt != undefined){
      //console.log(evt);
      let element_id = evt.node['element-id'];
      let target_id = evt.to.parent['element-id'];
      let parameters = {
        "requestUUID": "string",
        "user-id": 0,
        "element-id": element_id,
        "target-id": target_id
      }
            
      
      this.documentService.moveFolder(parameters).subscribe(
        data=>{
          /* //console.log(data); */
        },error=>{
          //console.log(error)
        }
      )
    }
  }

  moveFile(evt){
    if(evt != undefined){
      //console.log(evt);
      let element_id = evt.node['element-id'];
      let target_id = evt.to.parent['element-id'];
      let parameters = {
        "requestUUID": "string",
        "user-id": 0,
        "element-id": element_id,
        "target-id": target_id
      }
            
      
      this.documentService.moveFileTo(parameters).subscribe(
        data=>{
          console.log(data);
          
        },error=>{
          //console.log(error)
        }
      )
    }
  }

  saveSelectedNode(evt){
    this.renameNodeSelected = evt;
    //console.log(this.renameNodeSelected)
  }

  renameFolder(renameValue){
    
    if (renameValue.match(/^[A-Za-z-_0-9.]{3,}$/)) {
      this.validName = true;
      //console.log(this.renameNodeSelected);
      let element_id = this.renameNodeSelected['element-id'];
      let parameters = {
        "requestUUID": "string",
        "user-id": 0,
        "element-id": element_id,
        "rename-string": renameValue
      }

      this.documentService.renameFolder(parameters).subscribe(
        data=> {
          //console.log(data);
          /* this.loadTree() */
          setTimeout(() => {
            this.treeText.treeModel.getNodeBy(x => {
              if(x.data['element-id'] === element_id){
                x.data.name = renameValue;
              }
            })              
          }, 300);
          this.renameFile_input.nativeElement.value = '';
          this.renameFolderModal.hide();
        },error=>{
          //console.log(error)
        }
      )
    }else{
      this.validName = false;
    }
    this.renameNodeSelected = null;
  }

  saveMetadata(){
    console.log(this.metadata_array.value)
    let element_id = this.metadataForm.get('element_id').value;
    let parameters = {
      "requestUUID": "string",
      "metadata": {},
      "user-id": 0,
      "element-id": element_id
    };
    
    this.metadata_array.value.forEach(element => {
      parameters.metadata[element.key] = element.value
    });

    const expandedNodes = this.treeText.treeModel.expandedNodes;

    this.documentService.updateMetadata(parameters).subscribe(
      data=> {
        //console.log(data);
        this.nodes = data['documentSystem'];
        expandedNodes.forEach( (node: TreeNode) => {
          
          setTimeout(() => {
            this.treeText.treeModel.getNodeBy(x => {
              if(x.data['element-id'] === node.data['element-id']){
                x.setActiveAndVisible()
              }
            })              
          }, 300);
        })
      },error =>{
        console.log(error)
      }
    )
  }

  removeMetadataItem(index){
    this.metadata_array = this.metadataForm.get('metadata_array') as FormArray;
    this.memoryMetadata.splice(index, 1)
    this.metadata_array.removeAt(index);
    this.metadataForm.markAsTouched();
  }

  addMetadata(k?, v?){
    this.metadata_array = this.metadataForm.get('metadata_array') as FormArray;

    if (k == undefined) {
      this.metadata_array.push(this.createMetadataItem());
    } else {
      this.metadata_array.push(this.createMetadataItem(k, v));
    }
  }

  onCloseRemoveMetadata(){
    this.selectedFileToCopy = null;
  }

  deleteMetadata(){
    let element_id = this.selectedFileToCopy['element-id'];
    let parameters = {
      "requestUUID": "string",
      "user-id": 0,
      "element-id": element_id
    }

    const expandedNodes = this.treeText.treeModel.expandedNodes;

    this.documentService.deleteMetadata(parameters).subscribe(
      data=> {
        //console.log(data);
        this.nodes = data['documentSystem'];
        expandedNodes.forEach( (node: TreeNode) => {
          
          setTimeout(() => {
            this.treeText.treeModel.getNodeBy(x => {
              if(x.data['element-id'] === node.data['element-id']){
                x.setActiveAndVisible()
              }
            })              
          }, 300);
        })
      },error =>{
        console.log(error)
      }
    )
  }

  onCloseModal(){
    this.metadataForm.markAsUntouched();
    this.metadata_array.clear();
    this.memoryMetadata = [];
  }

  populateMetadata(item : any){
    let element_id = item['element-id'];
    this.metadataForm.get('element_id').setValue(element_id, {emitEvent : false});
    this.editMetadataModal.show();

    this.metadata_array = this.metadataForm.get('metadata_array') as FormArray;
    this.metadata_array.clear();
    this.memoryMetadata = [];

    if(Object.keys(item.metadata).length != 0){
      for (const [key, value] of Object.entries(item.metadata)) {
        console.log(`${key}: ${value}`);
        this.addMetadata(key, value)
      }
    }else{
      null;
    }
    
  }

  createMetadataItem(k?, v?){
    if(k != undefined){
      return this.formBuilder.group({
        key: new FormControl(k, [Validators.required, Validators.minLength(0)]),
        value: new FormControl(v, [Validators.required, Validators.minLength(0)])
      })
    }else{
      return this.formBuilder.group({
        key: new FormControl('', [Validators.required, Validators.minLength(0), this.uniqueIdValidator.bind(this)]),
        value: new FormControl('', [Validators.required, Validators.minLength(0)])
      })
    }
  }

  uniqueIdValidator(control: FormControl) {
    /* console.log(control)
    console.log(this.metadata_array) */
    if(control.value != ''){
      if (this.metadata_array.value.find(item => item.key === control.value)) {
        return { duplicate: true };
      } else {
        return null;
      }
    }else{
      return null
    }
    
  }

}

