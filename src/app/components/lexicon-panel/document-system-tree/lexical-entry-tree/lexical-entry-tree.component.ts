import { ApplicationRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, ITreeState } from '@circlon/angular-tree-component';
import { formTypeEnum, LexicalEntryRequest, searchModeEnum, typeEnum } from './interfaces/lexical-entry-interface'
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { FormControl, FormGroup } from '@angular/forms';

import * as _ from 'underscore';
declare var $: JQueryStatic;


import { debounceTime } from 'rxjs/operators';

const actionMapping: IActionMapping = {
  mouse: {
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    },
    click: TREE_ACTIONS.TOGGLE_ACTIVE,
    contextMenu: (tree, node, $event) => { 
      
    
    },
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
  searchIconSpinner = false;
  viewPort: any;
  titlePopover = "Search examples"
  popoverWildcards = "<span><b>Multiple character wildcard search:</b></span>&nbsp;<span><i>te*</i></span><br><span><b>Single character wildcard search:</b></span>&nbsp;<span><i>te?t</i></span><br> <b>Fuzzy search:</b></span>&nbsp;<span><i>test~</i></span><br><b>Weighted fuzzy search:</b></span>&nbsp;<span><i>test~0.8</i></span>"
  labelView = true;
  idView = false;
  offset = 0;
  limit = 500;

  counter = 0;

  @Input() triggerShowTree: any;
  @ViewChild('lexicalEntry') lexicalEntryTree: any;

  nodes;
  languages;
  types;
  authors;
  partOfSpeech;
  status = [{ "label": "false", "count": 0 }, { "label": "true", "count": 0 }];
  parameters: LexicalEntryRequest = {
    text: "",
    searchMode: searchModeEnum.equals,
    type: "",
    pos: "",
    formType: "entry",
    author: "",
    lang: "",
    status: "",
    offset: this.offset,
    limit: this.limit
  }


  options: ITreeOptions = {
    useVirtualScroll: true,
    scrollOnActivate: false,
    nodeHeight: 13,
    actionMapping,
    getChildren: this.getChildren.bind(this)
  };


  filterForm = new FormGroup({
    text: new FormControl(''),
    searchMode: new FormControl('equals'),
    type: new FormControl(''),
    pos: new FormControl(''),
    formType: new FormControl('entry'),
    author: new FormControl(''),
    lang: new FormControl(''),
    status: new FormControl('')
  });

  initialValues = this.filterForm.value;

  constructor(private renderer: Renderer2, private element: ElementRef, appRef: ApplicationRef, private lexicalService: LexicalEntriesService) { }

  ngOnInit(): void {
    this.viewPort = this.element.nativeElement.querySelector('tree-viewport');
    this.renderer.addClass(this.viewPort, 'search-results');

    this.onChanges();
    
    this.lexicalService.deleteReq$.subscribe(
      signal => {
        console.log("richiesta eliminazione lexical entry");
        this.lexEntryDeleteReq();
      }
    )

    this.lexicalService.getLexicalEntriesList(this.parameters).subscribe(
      data => {
        this.nodes = data['list'];
        this.counter = data['totalHits'];
      },
      error => {

      }
    );

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

  onChanges() {
    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(searchParams => {
      this.offset = 0;
      this.lexicalEntriesFilter(searchParams);
    })
  }

  lexEntryDeleteReq(){
    setTimeout(() => {
      this.lexicalEntriesFilter(this.parameters);
      this.lexicalEntryTree.treeModel.update();
      this.updateTreeView();
    }, 500);  
  }

  lexicalEntriesFilter(newPar) {
    this.searchIconSpinner = true;
    let parameters = newPar;
    parameters['offset'] = this.offset;
    parameters['limit'] = this.limit;
    this.lexicalService.getLexicalEntriesList(newPar).subscribe(
      data => {
        if(data['list'].length > 0){
          this.show = false;
        }else {
          this.show = true;
        }
        this.nodes = data['list'];
        this.counter = data['totalHits'];
        this.lexicalEntryTree.treeModel.update();
        this.updateTreeView();
        this.searchIconSpinner = false;
      },
      error => {

      }
    )
  }

  getParameters(){
    return this.filterForm.value;
  }

  ngAfterViewInit(): void {
    //@ts-ignore
    $('[data-toggle="popover"]').popover({
      html: true,
      title: this.titlePopover,
      content: this.popoverWildcards
    });
  }

  resetFields(){
    this.filterForm.reset(this.initialValues);
  }

  updateTreeView() {

    setTimeout(() => {
      this.lexicalEntryTree.sizeChanged();
      //@ts-ignore
      $('.lexical-tooltip').tooltip();
    }, 1000);
  }

  onEvent = ($event: any) => {
    console.log($event);

    setTimeout(() => {
      //@ts-ignore
      $('.lexical-tooltip').tooltip();
    }, 2000);
    
    if ($event.eventName == 'activate' && $event.node.data.lexicalEntry != undefined) {
      this.lexicalService.sendToCoreTab($event.node.data);
      let idLexicalEntry = $event.node.data.lexicalEntryInstanceName;
      this.lexicalService.getLexEntryData(idLexicalEntry).subscribe(
        data => {
          console.log(data)
          this.lexicalService.sendToRightTab(data);
        },
        error => {

        }
      )
    } else if($event.eventName == 'activate' && $event.node.data.form != undefined){
      this.lexicalService.sendToCoreTab($event.node.data);
    }else if($event.eventName == 'activate' && $event.node.data.sense != undefined){
      this.lexicalService.sendToCoreTab($event.node.data);
    }
    else if ($event.eventName == 'deactivate' && ($event.node.data.lexicalEntry == undefined && $event.node.data.form == undefined)) {
      this.lexicalService.sendToCoreTab(null);
      this.lexicalService.sendToRightTab(null);
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

    this.offset += 500;
    this.modalShow = true;

    //@ts-ignore
    $("#lazyLoadingModal").modal("show");
    $('.modal-backdrop').appendTo('.tree-view');
    $('body').removeClass("modal-open")
    $('body').css("padding-right", "");

    let parameters = this.filterForm.value;
    parameters['offset'] = this.offset;
    parameters['limit'] = this.limit;

    this.lexicalService.getLexicalEntriesList(parameters).pipe(debounceTime(200)).subscribe(
      data => {
        //@ts-ignore
        $('#lazyLoadingModal').modal('hide');
        $('.modal-backdrop').remove();
        for (var i = 0; i < data['list'].length; i++) {
          this.nodes.push(data['list'][i]);
        };
        this.counter = this.nodes.length;
        this.lexicalEntryTree.treeModel.update();
        this.updateTreeView();
        this.modalShow = false;
        
        setTimeout(()=>{
          //@ts-ignore
          $('#lazyLoadingModal').modal('hide');
          $('.modal-backdrop').remove();
        }, 300);
      },
      error => {

      }
    )
  }

  getChildren(node: any) {

    let newNodes: any;
    if (node.data.lexicalEntryInstanceName != undefined) {
      let instance = node.data.lexicalEntryInstanceName;
      this.lexicalService.getLexEntryElements(instance).subscribe(
        data => {
          data["elements"] = data["elements"].filter(function(obj){
            return obj.count != 0;
          })
          newNodes = data["elements"].map((c) => Object.assign({}, c));
        },
        error => {

        }
      );
    } else if (node.data.label == "form") {
      let parentInstance = node.parent.data.lexicalEntryInstanceName;
      this.lexicalService.getLexEntryForms(parentInstance).subscribe(
        data => {
          newNodes = data.map((c) => Object.assign({}, c));
          for (var i = 0; i < newNodes.length; i++) {
            if (newNodes[i].author == node.parent.data.author) {
              newNodes[i]['flagAuthor'] = false
            } else {
              newNodes[i]['flagAuthor'] = true
            }
          }
        }
      )
    } else if (node.data.label == "sense") {
      let parentInstance = node.parent.data.lexicalEntryInstanceName;
      this.lexicalService.getSensesList(parentInstance).subscribe(
        data => {
          newNodes = data.map((c) => Object.assign({}, c));
          for (var i = 0; i < newNodes.length; i++) {
            if (newNodes[i].author == node.parent.data.author) {
              newNodes[i]['flagAuthor'] = false
            } else {
              newNodes[i]['flagAuthor'] = true
            }
          }
        }
      )
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newNodes), 1000);
    });
  }
}