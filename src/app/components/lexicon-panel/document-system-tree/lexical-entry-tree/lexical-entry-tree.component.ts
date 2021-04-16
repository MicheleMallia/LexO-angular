import { ApplicationRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, ITreeState } from '@circlon/angular-tree-component';
import { formTypeEnum, LexicalEntryRequest, searchModeEnum, typeEnum } from './interfaces/lexical-entry-interface'
import { LexicalEntriesService } from 'src/app/services/lexical-entries.service';
import { FormControl, FormGroup } from '@angular/forms';

import * as _ from 'underscore';
declare var $: JQueryStatic;

import async from '../../../../../assets/data/lexicalEntry.json'

import forms from '../../../../../assets/data/mockForms.json';
import senses from '../../../../../assets/data/mockSenses.json';
import frames from '../../../../../assets/data/mockFrames.json';

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
        : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event)
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
  show = false;
  modalShow = false;
  flagAuthor = false;
  viewPort: any;
  titlePopover = "Search examples"
  popoverWildcards = "<span><b>Multiple character wildcard search:</b></span>&nbsp;<span><i>te*</i></span><br><span><b>Single character wildcard search:</b></span>&nbsp;<span><i>te?t</i></span><br> <b>Fuzzy search:</b></span>&nbsp;<span><i>test~</i></span><br><b>Weighted fuzzy search:</b></span>&nbsp;<span><i>test~0.8</i></span>"
  labelView = true;
  idView = false;
  offset = 0;
  limit = 500;


  @Input() triggerShowTree: any;
  @ViewChild('lexicalEntry') lexicalEntryTree: any;
  @ViewChild('pending') pendingCheckbox: any;
  @ViewChild('processing') processingCheckbox: any;
  @ViewChild('ready') readyCheckbox: any;

  nodes;
  languages;
  types;
  authors;
  partOfSpeech;
  status = [{ "label": "false", "count": 0 }, { "label": "true", "count": 0 }];
  asyncChildren = async;
  forms = forms;
  senses = senses;
  frames = frames;
  
  options: ITreeOptions = {
    useVirtualScroll: true,
    scrollOnActivate: false,
    nodeHeight: 13,
    actionMapping,
    getChildren: this.getChildren.bind(this)
  };
  

  filterForm = new FormGroup({
    text: new FormControl(''),
    searchMode : new FormControl('equals'),
    type: new FormControl(''),
    pos: new FormControl(''),
    formType : new FormControl(''),
    author : new FormControl(''),
    lang : new FormControl(''),
    status : new FormControl('')
  });

  constructor(private renderer: Renderer2, private element: ElementRef, appRef: ApplicationRef, private lexicalService: LexicalEntriesService) { }

  ngOnInit(): void {
    this.viewPort = this.element.nativeElement.querySelector('tree-viewport');
    this.renderer.addClass(this.viewPort, 'search-results');


    //BOOTSTRAP SERVICES WITH EMPTY PARAMETERS
    let parameters : LexicalEntryRequest = {
      text: "",
      searchMode: searchModeEnum.equals,
      type: typeEnum.word,
      pos: "",
      formType: "",
      author: "",
      lang: "",
      status: "",
      offset: this.offset,
      limit: this.limit
    }
    /* this.lexicalService.getLexicalEntriesList(parameters).subscribe(
      data => {
        console.log(data);
        this.nodes = data;
      },
      error => {
        console.log(error.message)
      }
    ); */

    this.lexicalService.getLanguages().subscribe(
      data => {
        this.languages = data;
      }
    );

    this.lexicalService.getTypes().subscribe(
      data => {
        this.types = data;
      }
    );

    this.lexicalService.getAuthors().subscribe(
      data => {
        this.authors = data;
      }
    );

    this.lexicalService.getPos().subscribe(
      data => {
        this.partOfSpeech = data;
      }
    )

    this.lexicalService.getStatus().subscribe(
      data => {
        this.status = data;
      }
    )
  }

  ngAfterViewInit(): void {
    //@ts-ignore
    $('[data-toggle="popover"]').popover({
      html: true,
      title: this.titlePopover,
      content: this.popoverWildcards
    });
  }

  updateTreeView() {

    setTimeout(() => {
      this.lexicalEntryTree.sizeChanged();
      //@ts-ignore
      $('.lexical-tooltip').tooltip();
    }, 10);
  }

  onEvent = ($event: any) => {
    console.log($event);

    //TRIGGER EVERYTIME A NODE IS EXPANDED
    setTimeout(() => {
      //@ts-ignore
      $('.lexical-tooltip').tooltip();
    }, 2000);

    if ($event.eventName == 'activate' && $event.node.data.label != "Forms") {
      this.lexicalService.sendToCoreTab($event.node.data);
    } else if ($event.eventName == 'deactivate') {
      this.lexicalService.sendToCoreTab(null);
    }
  };

  onKey = ($event: any) => {
    var that = this;
    setTimeout(function () {
      var results = document.body.querySelectorAll('tree-node-collection > div')[1].children.length;
      if (results == 0) {
        that.show = true;
      } else {
        that.show = false;
      }
    }, 5);
  };

  onScrollDown(treeModel: TreeModel) {
    console.log('scrolled!!');
    /*  this.start += 50;
     this.end += 50; */
    this.modalShow = true;
    //@ts-ignore
    $("#lazyLoadingModal").modal("show");

    //appending modal background inside the blue div
    $('.modal-backdrop').appendTo('.tree-view');

    //remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");



    setTimeout(() => {
      this.modalShow = false;
      //@ts-ignore
      $('#lazyLoadingModal').modal('hide');
      $('.modal-backdrop').remove();
    }, 1000)
  }

  getChildren(node: any) {


    let newNodes: any;

    if (node.data.iriURL != undefined) {
      newNodes = this.asyncChildren.map((c) => Object.assign({}, c));

    } else if (node.data.label != undefined) {
      if (node.data.label == "Forms") {
        newNodes = this.forms.map((c) => Object.assign({}, c));
        for (var i = 0; i < newNodes.length; i++) {
          if (newNodes[i].author == node.parent.data.author) {
            newNodes[i]['flagAuthor'] = false
          } else {
            newNodes[i]['flagAuthor'] = true
          }
        }
      } else if (node.data.label == "Senses") {
        newNodes = this.senses.map((c) => Object.assign({}, c));
        for (var i = 0; i < newNodes.length; i++) {
          if (newNodes[i].author == node.parent.data.author) {
            newNodes[i]['flagAuthor'] = false
          } else {
            newNodes[i]['flagAuthor'] = true
          }
        }
      } else if (node.data.label == "Frames") {
        newNodes = this.frames.map((c) => Object.assign({}, c));
        for (var i = 0; i < newNodes.length; i++) {
          if (newNodes[i].author == node.parent.data.author) {
            newNodes[i]['flagAuthor'] = false
          } else {
            newNodes[i]['flagAuthor'] = true
          }
        }
      }
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newNodes), 1000);
    });
  }
}