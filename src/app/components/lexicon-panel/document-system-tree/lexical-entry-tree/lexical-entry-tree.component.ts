import { ApplicationRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, ITreeState } from '@circlon/angular-tree-component';
import { formTypeEnum, LexicalEntryRequest, searchModeEnum, typeEnum } from './interfaces/lexical-entry-interface'
import { LexicalEntriesService } from 'src/app/services/lexical-entries/lexical-entries.service';
import { FormControl, FormGroup } from '@angular/forms';

import * as _ from 'underscore';
declare var $: JQueryStatic;


import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';

const actionMapping: IActionMapping = {
  mouse: {
    
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    },
    click: (tree, node, $event) => {
      
        TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
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
  interval;

  /* sub : Subscription; */

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

  constructor(private renderer: Renderer2, private element: ElementRef, private lexicalService: LexicalEntriesService) { 

    var refreshTooltip = setInterval((val)=>{
      //console.log('called'); 
      //@ts-ignore
      $('.lexical-tooltip').tooltip('disable');
      //@ts-ignore
      $('.lexical-tooltip').tooltip('enable');
       //@ts-ignore
       $('.note-tooltip').tooltip('disable');
      //@ts-ignore
      $('.note-tooltip').tooltip('enable');
    }, 2000)
  }

  ngOnInit(): void {
    
    this.viewPort = this.element.nativeElement.querySelector('tree-viewport');
    this.renderer.addClass(this.viewPort, 'search-results');

    this.onChanges();
    
    this.lexicalService.deleteReq$.subscribe(
      signal => {
        
        ////console.log("richiesta eliminazione lexical entry");
        if(signal != null){
          this.lexEntryDeleteReq(signal);     
        }
        
      }
    )

    this.lexicalService.addSubReq$.subscribe(
      signal => {

        if(signal != null){
          this.addSubElement(signal)
        }
      }
    )

    this.lexicalService.refreshFilter$.subscribe(
      signal => {
        
        if(signal != null){

          
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
      }
    )
    
    /* //console.log(this.parameters) */
    this.lexicalService.getLexicalEntriesList(this.parameters).subscribe(
      data => {
        this.nodes = data['list'];
        this.counter = data['totalHits'];
      },
      error => {
        //console.log(error)
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

  addSubElement(signal?){
    
    setTimeout(() => {
      let instanceName;
      let lex = signal.lex;
      let data = signal.data;
      console.log(data)
      switch(lex.request){
        case 'form' : instanceName = 'formInstanceName'; break;
        case 'sense' : instanceName = 'senseInstanceName'; break;
        case 'etymology' : instanceName = 'etymologyInstanceName'; break;
      }
      this.lexicalEntryTree.treeModel.getNodeBy(x=>{
        if(lex.lexicalEntryInstanceName != undefined){
          if(x.data.lexicalEntryInstanceName === lex.lexicalEntryInstanceName){
            if(x.data.children == undefined && !x.isExpanded){
              x.expand();              
              var that = this;
              this.interval = setInterval((val)=>{                
                if(x.data.children != undefined){
                  this.lexicalEntryTree.treeModel.getNodeBy(y=>{
                    if(y.data[instanceName] != undefined){
                      /* console.log(y.data[instanceName]) */
                      if(y.data[instanceName] === data[instanceName]){
                        y.setActiveAndVisible();
                        clearInterval(that.interval)
                        return true;
                      }else{
                        return false;
                      }
                    }else{
                      return false;
                    }           
                  })                  
                }
              }, 2000)
              
            }else if(x.data.children != undefined){
              let checkExistence = x.data.children.filter(element => {
                return element.label === lex.request
              });
              if(checkExistence.length == 1){
                x.data.children.filter(element => {
                  if(element.label === lex.request){
                    if(lex.request == 'sense'){
                      data['definition'] = 'no definition'
                    }
                    data['label'] = data[instanceName];
                    element.count++;
                    element.children.push(data);
                    this.lexicalEntryTree.treeModel.update();
                    this.lexicalEntryTree.treeModel.getNodeBy(y => {
                      if(y.data.label === data['label']){
                        y.setActiveAndVisible();
                      }
                    })
                    return true;
                  }else{
                    return false;
                  }
                });
              }else if(checkExistence.length == 0){
                let node = {
                  hasChildren : true,
                  label : lex.request,
                  children: [],
                  count : 0
                }
                x.data.children.push(node);
                x.data.children.sort(function(a, b) {
                  var textA = a.label.toUpperCase();
                  var textB = b.label.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                this.lexicalEntryTree.treeModel.update();
                x.data.children.filter(element => {
                  if(element.label === lex.request){
                    if(lex.request == 'sense'){
                      data['definition'] = 'no definition'
                    }
                    data['label'] = data[instanceName];
                    element.count++;
                    element.children.push(data);
                    this.lexicalEntryTree.treeModel.update();
                    this.lexicalEntryTree.treeModel.getNodeBy(y => {
                      if(y.data.label === data['label']){
                        y.setActiveAndVisible();
                      }
                    })
                    return true;
                  }else{
                    return false;
                  }
                });
              }
            }else{
              return false;
            }
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      })
    }, 300);
  }

  lexEntryDeleteReq(signal?){


    setTimeout(() => {
      
      
      this.lexicalEntryTree.treeModel.getNodeBy(x => {
        if(signal.lexicalEntryInstanceName != undefined){
          if(x.data.lexicalEntryInstanceName === signal.lexicalEntryInstanceName){
            
            x.parent.data.children.splice(x.parent.data.children.indexOf(x.data), 1);
            
            
            this.lexicalEntryTree.treeModel.update();
            if(this.nodes.length == 0){
              this.lexicalEntriesFilter(this.parameters);
            }
            
            return true;
          }else{
            return false;
          }
        }else if(signal.formInstanceName != undefined){
          if(x.data.formInstanceName === signal.formInstanceName){
            
            x.parent.data.children.splice(x.parent.data.children.indexOf(x.data), 1);
            let countForm = x.parent.data.count;
            if(countForm != 0){
              x.parent.data.count--;
              countForm--;
            }
            
            if(countForm == 0){
              x.parent.parent.data.children.splice(x.parent.parent.data.children.indexOf(x.parent.data), 1)
            }
            console.log(x.parent)
            
            this.lexicalEntryTree.treeModel.update()
            
            return true;
          }else{
            return false;
          }
        }else if(signal.senseInstanceName != undefined){
          if(x.data.senseInstanceName === signal.senseInstanceName){
            
            x.parent.data.children.splice(x.parent.data.children.indexOf(x.data), 1);
            let countSense = x.parent.data.count;
            if(countSense != 0){
              x.parent.data.count--;
              countSense--;
            }
            
            if(countSense == 0){
              x.parent.parent.data.children.splice(x.parent.parent.data.children.indexOf(x.parent.data), 1)
            }
            console.log(x.parent)
            
            this.lexicalEntryTree.treeModel.update()
            
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      })
      
    }, 300);  
  }

  lexicalEntriesFilter(newPar) {
    
    setTimeout(() => {
      const viewPort_prova = this.element.nativeElement.querySelector('tree-viewport') as HTMLElement;
      viewPort_prova.scrollTop = 0
    }, 300);
    
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
    return this.initialValues;
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
    this.initialValues.text = '';
    this.filterForm.reset(this.initialValues);
    setTimeout(() => {
      this.filterForm.get('text').setValue('', {eventEmit : false});
      this.lexicalEntriesFilter(this.parameters);
      this.lexicalEntryTree.treeModel.update();
      this.updateTreeView();
      /* this.lexicalService.sendToCoreTab(null);
      this.lexicalService.sendToRightTab(null); */
    }, 500);  
    
  }

  updateTreeView() {

    setTimeout(() => {
      this.lexicalEntryTree.sizeChanged();
      //@ts-ignore
      $('.lexical-tooltip').tooltip();
    }, 1000);
  }

  onEvent = ($event: any) => {
    
    console.log($event)
    setTimeout(() => {
      //@ts-ignore
      $('.lexical-tooltip').tooltip();
    }, 2000);
    
    if ($event.eventName == 'activate' && $event.node.data.lexicalEntry != undefined 
                                       && $event.node.data.form == undefined
                                       && $event.node.data.sense == undefined) {
      //this.lexicalService.sendToCoreTab($event.node.data);
      let idLexicalEntry = $event.node.data.lexicalEntryInstanceName;
      this.lexicalService.getLexEntryData(idLexicalEntry).subscribe(
        data => {
          this.lexicalService.sendToCoreTab(data);
          this.lexicalService.sendToRightTab(data);
          this.lexicalService.updateLexCard({lastUpdate : data['lastUpdate'], creationDate : data['creationDate']});
        },
        error => {

        }
      )
    } else if($event.eventName == 'activate' && $event.node.data.form != undefined){

      let formId = $event.node.data.formInstanceName;

      this.lexicalService.getFormData(formId, 'core').subscribe(
        data => {
          data['parentNodeLabel'] = $event.node.parent.parent.data.label;
          data['parentNodeInstanceName'] = $event.node.parent.parent.data.lexicalEntryInstanceName;
          this.lexicalService.sendToCoreTab(data)
          this.lexicalService.sendToRightTab(data)
        },
        error => {
          //console.log(error)
        }
      )
    
    }else if($event.eventName == 'activate' && $event.node.data.sense != undefined){

      let senseId = $event.node.data.senseInstanceName;

      this.lexicalService.getSenseData(senseId, 'core').subscribe(
        data => {
          data['parentNodeLabel'] = $event.node.parent.parent.data.label;
          data['parentNodeInstanceName'] = $event.node.parent.parent.data.lexicalEntryInstanceName;
          console.log(data)
          this.lexicalService.sendToCoreTab(data)
          this.lexicalService.sendToRightTab(data)
        },
        error => {
          //console.log(error)
        }
      )
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
        //this.counter = this.nodes.length;
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
          
          newNodes.forEach(element => {
            setTimeout(() => {
              try{
                const someNode = this.lexicalEntryTree.treeModel.getNodeById(element.id);
              
                someNode.expand();
                console.log(someNode)
                var that = this;
                this.interval = setInterval((val)=>{                
                               
                  
                }, 2000)
              }catch(e){
                console.log(e)
              }
              
            }, 1000);
            
          });
          
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
            if (newNodes[i].creator == node.parent.data.creator) {
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
          /* //console.log(data) */
          newNodes = data.map((c) => Object.assign({}, c));
          for (var i = 0; i < newNodes.length; i++) {
            newNodes[i]['hasChildren'] = null;
            if (newNodes[i].creator == node.parent.data.creator) {
              newNodes[i]['flagAuthor'] = false
            } else {
              newNodes[i]['flagAuthor'] = true
            }
          }
        },error => {
          //console.log(error)
        }
      )
    } else if (node.data.label == "concept") {
      let parentInstance = node.parent.data.lexicalEntryInstanceName;
      //console.log("cercare concetto")
      
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newNodes), 1000);
    });
  }
}