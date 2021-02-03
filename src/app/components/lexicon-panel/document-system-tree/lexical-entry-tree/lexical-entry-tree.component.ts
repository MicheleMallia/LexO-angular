import { Component, OnInit } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from '@circlon/angular-tree-component';
import { v4 } from 'uuid';


const actionMapping: IActionMapping = {
  mouse: {
    /*
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    */
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
    mouseOver: (tree, node, $event) => {
      $event.preventDefault();
      console.log(`mouseOver ${node.data.name}`);
    },
    mouseOut: (tree, node, $event) => {
      $event.preventDefault();
      console.log(`mouseOut ${node.data.name}`);
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

  show = false;

  constructor() { }

  ngOnInit(): void {
  }

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { 
          name: 'child1' 
        },
        { 
          name: 'child2' 
        }
      ]
    },
    {
      name: 'root2',
      id: 2,
      children: [
        { 
          name: 'child2.1', 
          children: [] 
        },
        { 
          name: 'child2.2', children: [
            {
              name: 'grandchild2.2.1'
            }
          ] 
        }
      ]
    },
    { 
      name: 'root3' 
    },
    { 
      name: 'root4', 
      children: [] 
    },
    { 
      name: 'root5', 
      children: null 
    }
  ];

  options: ITreeOptions = {
    actionMapping,
    allowDrag: (node) => node.isLeaf,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`
    })
  };

  onEvent = ($event: any) => console.log($event);

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
}

