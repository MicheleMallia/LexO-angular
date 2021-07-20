import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);

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

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  
  show = false;
  nodes : any;

  renameNodeSelected : any;
  validName = null;

  options: ITreeOptions = {
    actionMapping,
    allowDrag: (node) => node.isLeaf,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`
    })
  };


  @ViewChild('renameInput') input:ElementRef; 
  @ViewChild('renameFolderModel', {static: false}) modal: ModalComponent;
  
  constructor(private documentService: DocumentSystemService) { }

  ngOnInit(): void {

    this.loadTree();


  }

  ngAfterViewInit(){
    
  }
  
  onEvent = ($event: any) => console.log($event);

  onMoveNode($event) {
    console.log($event);
    let node_type = $event.node.type;
    let target_type = $event.node.type;
    if(node_type === 'directory' && target_type === 'directory'){
      this.moveFolder($event)
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
    console.log(message);
  }

  loadTree(){
    this.documentService.getDocumentSystem().subscribe(
      data => {
        console.log(data)
        this.nodes = data['documentSystem']
      },
      error => {
        console.log(error)
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
  

  addFolder(evt){
    if(evt != undefined){
      let element_id = evt['element-id'];
      let parameters = {
        "requestUUID" : "string",
        "user-id" : 0,
        "element-id" : element_id
      }
      this.documentService.addFolder(parameters).subscribe(
        data=>{
          console.log(data);
          setTimeout(() => {
            this.loadTree();
          }, 300);
          
        },error=>{
          console.log(error)
        }
      )
    }
  }

  removeFolder(evt){
    if(evt != undefined){
      let element_id = evt['element-id'];
      let parameters = {
        "requestUUID" : "string",
        "user-id" : 0,
        "element-id" : element_id
      }
      this.documentService.removeFolder(parameters).subscribe(
        data=>{
          console.log(data);
          setTimeout(() => {
            this.loadTree();
          }, 300);
          
        },error=>{
          console.log(error)
        }
      )
    }
  }

  moveFolder(evt){
    if(evt != undefined){
      console.log(evt);
      let element_id = evt.node['element-id'];
      let target_id = evt.to.parent['element-id'];
      let parameters = {
        "requestUUID": "string",
        "user-id": 0,
        "element-id": element_id,
        "target-id": target_id
      }
      console.log(parameters)
      this.documentService.removeFolder(parameters).subscribe(
        data=>{
          console.log(data);
          setTimeout(() => {
            this.loadTree();
          }, 300);
          
        },error=>{
          console.log(error)
        }
      )
    }
  }

  saveSelectedNode(evt){
    this.renameNodeSelected = evt;
    console.log(this.renameNodeSelected)
  }

  renameFolder(renameValue){
    /* console.log(this.renameNodeSelected);
    console.log(renameValue);
    console.log(renameValue.match(/^[A-Za-z]{3,}$/)) */
    if (renameValue.match(/^[A-Za-z]{3,}$/)) {
      this.validName = true;
      console.log(this.renameNodeSelected);
      let element_id = this.renameNodeSelected['element-id'];
      let parameters = {
        "requestUUID": "string",
        "user-id": 0,
        "element-id": element_id,
        "rename-string": renameValue
      }

      this.documentService.renameFolder(parameters).subscribe(
        data=> {
          console.log(data);
          this.loadTree()
          this.input.nativeElement.value = '';
          this.modal.hide();
        },error=>{
          console.log(error)
        }
      )
    }else{
      this.validName = false;
    }
    this.renameNodeSelected = null;
  }
}

