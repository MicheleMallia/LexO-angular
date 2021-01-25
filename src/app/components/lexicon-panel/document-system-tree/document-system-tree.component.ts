import { Component, OnInit } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from '@circlon/angular-tree-component';


const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
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
  selector: 'app-document-system-tree',
  templateUrl: './document-system-tree.component.html',
  styleUrls: ['./document-system-tree.component.scss']
})
export class DocumentSystemTreeComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  options: ITreeOptions = {
    actionMapping
  };

  onEvent = ($event: any) => console.log($event);

  filterFn(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => fuzzysearch(value, node.data.name));
  }
  

}


function fuzzysearch (needle: string, haystack: string) {
  const haystackLC = haystack.toLowerCase();
  const needleLC = needle.toLowerCase();

  const hlen = haystack.length;
  const nlen = needleLC.length;

  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needleLC === haystackLC;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needleLC.charCodeAt(i);

    while (j < hlen) {
      if (haystackLC.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}