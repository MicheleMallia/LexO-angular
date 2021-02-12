import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, ITreeState } from '@circlon/angular-tree-component';
import * as _ from 'underscore';

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
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};

@Component({
  selector: 'app-lexical-entry-tree',
  templateUrl: './lexical-entry-tree.component.html',
  styleUrls: ['./lexical-entry-tree.component.scss']
})

export class LexicalEntryTreeComponent implements OnInit {
  state!: ITreeState;
  word = false;
  multiword = false;
  show = false;
  pending = true;
  validated = true;
  searchText = '';
  typeField = 'node.type.includes(\'\')';
  posField = 'node.pos.includes(\'\')';
  
  nodes = [
    {
      id: 1,
      name: 'mangiare',
      pending: true,
      validated: false,
      pos: 'verb',
      lang: 'it',
      type: 'word',
      notes: '',
      author: '',
      children: [
        {
          name: 'mangio',
          notes: '',
          author: 'Antonio',
        },
        {
          name: 'mangia',
          notes: 'Forma femminile',
          author: 'Francesca',
        },
        {
          name: 'senso1',
          notes: 'Forma femminile',
          author: 'Francesca',
        }
      ]
    },
    {
      id: 2,
      name: 'mangime',
      pending: true,
      validated: false,
      pos: 'noun',
      lang: 'it',
      type: 'word',
      notes: '',
      author: ''
    },
    { 
      id: 3,
      name: 'whales',
      pos: 'noun',
      pending: false,
      validated: false,
      lang: 'en',
      type: 'word',
      notes: '',
      author: ''
    },
    { 
      id: 4,
      name: 'avvezzo', 
      pending: false,
      validated: true,
      pos: 'adj',
      lang: 'it',
      type: 'word',
      notes: 'asd',
      author: '',
    },
    { 
      id: 5,
      name: 'puentes', 
      pending: true,
      validated: false,
      pos: 'noun',
      lang: 'es',
      type: 'word',
      notes: '',
      author: ''
    },
    { 
      id: 6,
      name: 'casa di cura', 
      pending: false,
      validated: false,
      pos: 'noun',
      lang: 'es',
      type: 'multiword',
      notes: 'asd',
      author: 'asd',    
    }
  ];

  options: ITreeOptions = {
    actionMapping
  };

  @ViewChild('lexicalEntry') lexicalEntryTree: any;
  
  @ViewChild('pending') pendingCheckbox: any;
  @ViewChild('processing') processingCheckbox: any;
  @ViewChild('ready') readyCheckbox: any;

  constructor() { }

  ngOnInit(): void {  }

  onEvent = ($event: any) => {
    console.log($event)
  };

  onKey = ($event:any) => {
    var that = this;
    setTimeout(function(){ 
      var results = document.body.querySelectorAll('tree-node-collection > div')[1].children.length;
      if(results == 0){
        that.show = true;
      } else {
        that.show = false;
      }
    }, 5);  
  };

  lexicalFilter(value: string, treeModel: TreeModel, event:any){
    
      
    var id = event.currentTarget.id;
    var results = []; 
    var children: any[] = [];
    if(event instanceof KeyboardEvent){
      this.searchText = value;
    }else{
      if(id == 'type' && value != 'Tipo'){
        this.typeField = 'node.type == \''+value.toLowerCase()+'\'';
        
      }else if(id == 'type' && value == 'Tipo'){
        this.typeField = 'node.type.includes(\'\')';
      }  
      if(id == 'pos' && value != 'Pos'){
        this.posField = 'node.pos == \''+value.toLowerCase()+'\'';
      }else if(id == 'pos' && value == 'Pos'){
        this.posField = 'node.pos.includes(\'\')';
      }
    }

    if(event.target.localName == 'input'){
      
      if(id == 'pending'){
        if(this.pendingCheckbox.nativeElement.checked == false){
          this.pending = false;
          
        }else{
          this.pending = true;
          
        }
      }     
      if(id == 'ready'){
        if(this.readyCheckbox.nativeElement.checked == false){
          this.validated = false;
          
        }else{
          this.validated = true;
          
        }
      }  
    }
    
    
    results = _.filter(treeModel.nodes, (node) =>{

      if(this.processingCheckbox.nativeElement.checked && (this.readyCheckbox.nativeElement.checked || this.pendingCheckbox.nativeElement.checked)){
        
        return node.name.includes(this.searchText)
            && eval(this.typeField)
            && eval(this.posField)
            && (node.pending == this.pending || node.pending == false)
            && (node.validated == this.validated || node.validated == false);
      }else if(this.processingCheckbox.nativeElement.checked && !(this.readyCheckbox.nativeElement.checked && this.pendingCheckbox.nativeElement.checked)){
        
        return node.name.includes(this.searchText)
            && eval(this.typeField)
            && eval(this.posField)
            && node.pending == false
            && node.validated == false;
      }else if(!this.processingCheckbox.nativeElement.checked && !(this.readyCheckbox.nativeElement.checked || this.pendingCheckbox.nativeElement.checked)){
        
        return node.name.includes(this.searchText)
            && eval(this.typeField)
            && eval(this.posField)
            && node.pending == null
            && node.validated == null;
      }
      else if(!this.processingCheckbox.nativeElement.checked && (this.readyCheckbox.nativeElement.checked && this.pendingCheckbox.nativeElement.checked)){ 
        
        return node.name.includes(this.searchText)
            && eval(this.typeField)
            && eval(this.posField)
            && ((node.pending == true && node.validated == false)
            || (node.pending == false && node.validated == true));
      }
      else {
       
        return node.name.includes(this.searchText)
            && eval(this.typeField)
            && eval(this.posField)
            && node.pending == this.pending
            && node.validated == this.validated 
      }
      
    });
    
    _.filter(treeModel.nodes, (node) =>{
      if(node["children"] != undefined){
        children = _.filter(node.children, (child) => {
          return child.name.startsWith(this.searchText)
                && eval(this.typeField)
                && eval(this.posField);
        })
        if(children.length > 0 && this.searchText != ''){
          results.unshift(node);
        }
      }
    });

    console.log(children)
    /* console.log(results);
    console.log(children); */
    
    for(let i = 0; i < treeModel.nodes.length; i++){
      let nodeTree = treeModel.nodes[i];
      treeModel.setIsHidden({id: nodeTree.id}, true);
      if(nodeTree["children"] != undefined){
        for(let j = 0; j < nodeTree.children.length; j++){
          let childrenNodes = nodeTree.children[j];
          treeModel.setIsHidden({id: childrenNodes.id}, true);
        }
      }
    }

    if(results.length > 0){
      for(var i = 0; i < results.length; i++){
        let nodeResults = results[i];
        for(var j = 0; j < treeModel.nodes.length; j++){
          let nodeTree = treeModel.nodes[j];
          if(nodeResults.id == nodeTree.id){
            treeModel.setIsHidden({id: nodeTree.id}, false);
            if(nodeTree["children"] != undefined){
              for(var k = 0; k < nodeTree.children.length; k++){
                let nodeChildren = nodeTree.children[k];
                for(var l = 0; l < children.length; l++){
                  let nodeResultsChildren = children[l];
                  if(nodeChildren.id == nodeResultsChildren.id){
                    treeModel.setIsHidden({id: nodeChildren.id}, false);
                  }
                }
              }
            }
          }
        }
      }
      this.show = false;
    }else{
      for(var i = 0; i < treeModel.nodes.length; i++){
        let node = treeModel.nodes[i];
        treeModel.setIsHidden({id: node.id}, true);
        if(node["children"] != undefined){
          for(var j = 0; j < node.children; j++){
            let nodeChildren = node.children[j]; 
            treeModel.setIsHidden({id: nodeChildren.id}, true);
          }
        }
        this.show = true;
      }
    }
  }
}